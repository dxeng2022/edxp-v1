package com.edxp.s3file.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.CopyObjectRequest;
import com.amazonaws.services.s3.model.GetObjectMetadataRequest;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ListObjectsRequest;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.amazonaws.services.s3.transfer.Download;
import com.amazonaws.services.s3.transfer.MultipleFileDownload;
import com.amazonaws.services.s3.transfer.Transfer;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.edxp._core.common.utils.FileUtil;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.s3file.dto.requset.FileDeleteRequest;
import com.edxp.s3file.dto.requset.FileDownloadsRequest;
import com.edxp.s3file.dto.requset.FileFolderAddRequest;
import com.edxp.s3file.dto.requset.FileUpdateRequest;
import com.edxp.s3file.dto.requset.FileUploadRequest;
import com.edxp.s3file.dto.response.FileFolderListResponse;
import com.edxp.s3file.dto.response.FileListResponse;
import com.edxp.s3file.dto.response.FileVolumeResponse;
import com.edxp.user.dto.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static com.edxp._core.constant.Numbers.MB;

@Slf4j
@RequiredArgsConstructor
@Service
public class FileService {
    private final AmazonS3Client amazonS3Client;
    private final TransferManager transferManager;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${file.path}")
    private String downloadFolder;

    @Value("${file.location}")
    private String location;

    private final static int MAX_UPLOAD_FILES = 5; // 업로드 파일 한 번에 최대 5개
    private final static long MAX_UPLOAD_VOLUME = 30 * MB; // 30 MB
    private final static long MAX_UPLOAD_CHARGED_VOLUME = 300 * MB; // 300 MB
    private static final Set<String> UPLOAD_FOLDER_LIST = Set.of( // 업로드 가능한 폴더 리스트
            "draw", "sheet", "doc", "doc_risk"
    );

    /**
     * [ 파일 및 폴더 리스트 불러오기 ]
     *
     * @param userId      value of user id
     * @param currentPath current path of s3 objects
     * @return List&lt;FileListResponse&gt;
     * – fileName, fileSize, filePath, extension, registeredAt, originalFileSize, originalRegisteredAt
     * @apiNote AWS S3 에서 현재 경로의 파일과 폴더 정보를 불러오는 API
     * @since 2023.06.07
     */
    @Transactional(readOnly = true)
    public List<FileListResponse> getFiles(Long userId, String currentPath) {
        log.debug("path : {}", currentPath);
        requestPathValidation(currentPath);

        ListObjectsRequest listObjectsRequest = getListObjectsRequest(userId, currentPath);
        listObjectsRequest.setDelimiter("/");
        ObjectListing s3Objects;

        List<FileListResponse> files = new ArrayList<>();

        do {
            s3Objects = amazonS3Client.listObjects(listObjectsRequest);

            for (String commonPrefix : s3Objects.getCommonPrefixes()) {
                int startIdx = commonPrefix.indexOf("user");
                String folderPath = commonPrefix.substring(commonPrefix.indexOf("/", startIdx) + 1);

                ListObjectsRequest folderObjectsRequest = getListObjectsRequest(userId, folderPath);
                ObjectListing folderObjects = amazonS3Client.listObjects(folderObjectsRequest);
                List<S3ObjectSummary> folderObjectSummaries = new ArrayList<>(folderObjects.getObjectSummaries());
                Optional<S3ObjectSummary> latestObject = folderObjectSummaries.stream()
                        .max(Comparator.comparing(S3ObjectSummary::getLastModified));
                Date latModified = latestObject.map(S3ObjectSummary::getLastModified).orElse(new Date(0));
                long folderSize = folderObjectSummaries.stream().mapToLong(S3ObjectSummary::getSize).sum();

                files.add(FileListResponse.from(commonPrefix, folderPath, latModified, folderSize));
            }

            for (S3ObjectSummary s3ObjectSummary : s3Objects.getObjectSummaries()) {
                String key = s3ObjectSummary.getKey();
                if (key.charAt(key.length() - 1) != '/') {
                    files.add(FileListResponse.from(s3ObjectSummary));
                }
            }

            listObjectsRequest.setMarker(s3Objects.getNextMarker());
        } while (s3Objects.isTruncated());

        return files;
    }

    /**
     * [ 폴더 리스트 불러오기 ]
     *
     * @param userId      user id signed in
     * @param currentPath current path
     * @return List&lt;FileFolderListResponse&gt; – folderName, folderPath
     * @apiNote AWS S3에서 전체 폴더 정보만 불러오는 API
     * @since 2023.06.08
     */
    @Transactional(readOnly = true)
    public List<FileFolderListResponse> getFolders(Long userId, String currentPath) {
        log.debug("folderPath : {}", currentPath);

        ListObjectsRequest listObjectsRequest = getListObjectsRequest(userId, currentPath);
        ObjectListing s3Objects;

        List<FileFolderListResponse> folders = new ArrayList<>();

        do {
            s3Objects = amazonS3Client.listObjects(listObjectsRequest);
            for (S3ObjectSummary s3ObjectSummary : s3Objects.getObjectSummaries()) {
                String key = s3ObjectSummary.getKey();
                if (key.charAt(key.length() - 1) == '/') {
                    folders.add(FileFolderListResponse.from(s3ObjectSummary));
                }
            }

            listObjectsRequest.setMarker(s3Objects.getNextMarker());
        } while (s3Objects.isTruncated());

        return folders;
    }

    /**
     * [ 폴더 용량 불러오기 ]
     *
     * @param user user signed in
     * @param currentPath current path
     * @return FileVolumeResponse – volume, originalVolume
     * @apiNote AWS S3 에서 전체 정보를 불러와 용량을 모두 더한 후에 전체 용량을 반환하는 API
     * @since 2023.07.19
     */
    @Transactional(readOnly = true)
    public FileVolumeResponse getVolume(User user, String currentPath) {
        log.debug("folderPath : {}", currentPath);
        requestPathValidation(currentPath);

        ListObjectsRequest listObjectsRequest = getListObjectsRequest(user.getId(), currentPath);
        ObjectListing s3Objects;

        List<S3ObjectSummary> s3ObjectSummaries = new ArrayList<>();

        do {
            s3Objects = amazonS3Client.listObjects(listObjectsRequest);
            s3ObjectSummaries.addAll(s3Objects.getObjectSummaries());

            listObjectsRequest.setMarker(s3Objects.getNextMarker());
        } while (s3Objects.isTruncated());

        long userVolume = MAX_UPLOAD_VOLUME;
        if (user.isUserCharged()) {
            userVolume = MAX_UPLOAD_CHARGED_VOLUME;
        }

        return FileVolumeResponse.from(s3ObjectSummaries, userVolume);
    }

    /**
     * [ 새 폴더 추가 ]
     *
     * @param userId  user id signed in
     * @param request current path, folder name to add
     * @apiNote AWS S3 에 폴더 객체 생성을 요청하는 API
     * @since 2023.07.06
     */
    @Transactional
    public void addFolder(Long userId, FileFolderAddRequest request) {
        log.debug("path : {}", getPath(userId, request.getCurrentPath()));

        StringBuilder filePath = getPath(userId, request.getCurrentPath()).append(request.getFolderName()).append("/");

        boolean isObjectExist = amazonS3Client.doesObjectExist(bucket, String.valueOf(filePath));

        if (!isObjectExist) {
            amazonS3Client.putObject(
                    bucket, String.valueOf(filePath), new ByteArrayInputStream(new byte[0]), new ObjectMetadata()
            );
        } else {
            throw new EdxpApplicationException(ErrorCode.DUPLICATED_FILE_NAME);
        }
    }

    /**
     * [ 파일 업로드 ]
     *
     * @param user  user signed in
     * @param request current path, files
     * @apiNote AWS S3에 새로운 객체 생성을 요청하는 API
     * @since 2023.06.10
     */
    @Transactional
    public void uploadFile(User user, FileUploadRequest request) {
        requestPathValidation(request.getCurrentPath()); // 경로 확인
        uploadFileNumberValidation(request); // 파일 개수 확인
        uploadVolumeValidation(user, request); // 용량 확인

        request.getFiles().forEach(file -> {
            try {
                String fileName = file.getOriginalFilename();
                log.debug("path : {}", getPath(user.getId(), request.getCurrentPath()));

                StringBuilder filePath = getPath(user.getId(), request.getCurrentPath()).append(fileName);
                duplicateFilenameValidation(String.valueOf(filePath));

                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentType(file.getContentType());
                metadata.setContentLength(file.getSize());

                amazonS3Client.putObject(bucket, String.valueOf(filePath), file.getInputStream(), metadata);
            } catch (IOException e) {
                throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, String.format("%s upload is failed", file.getOriginalFilename()));
            }
        });
    }

    /**
     * [ 파일 다운로드 ]
     *
     * @param httpRequest  java servlet request
     * @param httpResponse java servlet response
     * @param request      currentPath, filePaths
     * @param userId       user id signed in
     * @apiNote 단일 파일 다운로드 - HttpResponse 객체에 파일 정보를 담아서 반환
     * <p>
     * 다중 파일 다운로드 - 파일을 로컬에 다운 받아 압축 하면서 HttpResponse 객체에 반환
     * @since 2023.06.30
     */
    @Transactional
    public void downloadFiles(
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse,
            FileDownloadsRequest request,
            Long userId
    ) {
        StringBuilder userPath = new StringBuilder();
        userPath.append("dxeng/").append(location).append("/")
                .append("user_").append(String.format("%06d", userId)).append("/");

        // 단일 파일 다운로드
        if (request.getFilePaths().size() == 1
                && request.getFilePaths().get(0).charAt(request.getFilePaths().get(0).length() - 1) != '/'
        ) {
            String filePath = String.valueOf(userPath.append(request.getFilePaths().get(0)));
            String fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
            log.debug("filePath: {}", request.getFilePaths().get(0));

            httpResponse.addHeader(
                    "Content-Disposition",
                    "attachment; filename=" + FileUtil.getEncodedFileName(httpRequest, fileName)
            );

            httpResponse.setContentType("application/octet-stream");
            S3Object object = amazonS3Client.getObject(new GetObjectRequest(bucket, filePath));

            log.info("single file download - {} : success", request.getFilePaths().get(0));

            try (
                    S3ObjectInputStream objectInputStream = object.getObjectContent();
                    OutputStream responseOutputStream = httpResponse.getOutputStream()
            ) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = objectInputStream.read(buffer)) != -1) {
                    responseOutputStream.write(buffer, 0, bytesRead);
                }
                return;
            } catch (Exception ex) {
                throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "File download is failed");
            }
        }

        // 멀티 파일 다운로드
        // (1) 서버 로컬에 생성되는 디렉토리, 해당 디렉토리에 파일이 다운로드된다
        File localDirectory =
                new File(downloadFolder + "/" + RandomStringUtils.randomAlphanumeric(6) + "-download");
        httpResponse.addHeader(
                "Content-Disposition", "attachment; filename=" + localDirectory.getName() + ".zip"
        );

        try (ZipOutputStream zipOut = new ZipOutputStream(httpResponse.getOutputStream())) {
            // (2) TransferManager -> localDirectory 에 파일 다운로드
            ArrayList<Transfer> downloadList = new ArrayList<>();
            for (String path : request.getFilePaths()) {
                if (path.charAt(path.length() - 1) == '/') {
                    MultipleFileDownload downloadDirectory = transferManager.downloadDirectory(
                            bucket, userPath + path, localDirectory
                    );
                    downloadList.add(downloadDirectory);
                } else {
                    Download download = transferManager.download(
                            bucket, userPath + path, new File(localDirectory + "/" + userPath + path)
                    );
                    downloadList.add(download);
                }
            }

            // (3) 다운로드 상태 확인
            log.info("[" + localDirectory.getName() + "] download progressing... start");
            DecimalFormat decimalFormat = new DecimalFormat("##0.00");
            while (!FileUtil.isDownOver(downloadList)) {
                Thread.sleep(1000);

                double percentTransferred = FileUtil.getAverageList(downloadList);
                log.info(
                        "[" + localDirectory.getName() + "] "
                                + decimalFormat.format(percentTransferred)
                                + "% download progressing..."
                );
            }
            log.info("[" + localDirectory.getName() + "] download directory from S3 success!");

            // (4) 로컬 디렉토리 -> 압축하면서 다운로드
            log.info("compressing to zip file...");
            addFolderToZip(zipOut, localDirectory + "/" + userPath + request.getCurrentPath());
        } catch (Exception e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "File download is failed");
        } finally {
            // (5) 로컬 디렉토리 삭제
            FileUtil.remove(localDirectory);
        }
    }

    /**
     * [ 분석용 파일 다운로드 ]
     *
     * @param userId   signed in
     * @param fileName filename to download
     * @param myPath filePath to download
     * @return file
     * @apiNote 분석용 파일을 다운로드 하는 API
     * @since 2023.09.27
     */
    @Transactional
    public File downloadAnalysisFile(Long userId, String fileName, String myPath) {
        StringBuilder userPath = new StringBuilder();
        userPath.append("user_").append(String.format("%06d", userId)).append("/").append(myPath);

        StringBuilder s3Path = new StringBuilder();
        s3Path.append("dxeng").append("/").append(location).append("/").append(userPath);

        try {
            File file = new File(downloadFolder + "/" + userPath + "/" + fileName);
            Download download = transferManager.download(bucket, String.valueOf(s3Path.append("/").append(fileName)), file);

            log.info("[" + fileName + "] download progressing... start");
            DecimalFormat decimalFormat = new DecimalFormat("##0.00");
            while (!download.isDone()) {
                Thread.sleep(1000);

                double percentTransferred = download.getProgress().getPercentTransferred();
                log.info(
                        "[" + fileName + "] "
                                + decimalFormat.format(percentTransferred)
                                + "% download progressing..."
                );
            }
            log.info("single file download - {} : success", fileName);

            return file;
        } catch (InterruptedException e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "File download is failed");
        } catch (AmazonS3Exception e) {
            throw new EdxpApplicationException(ErrorCode.FILE_NOT_FOUND);
        }
    }

    /**
     * [ 파일 이름 변경 및 업데이트 ]
     *
     * @param user  user signed in
     * @param request currentPath, currentName, updateName, extension
     * @apiNote 파일 이름을 변경하는 API
     * @since 2023.08.02
     */
    @Transactional
    public void updateFile(User user, FileUpdateRequest request) {
        StringBuilder path = getPath(user.getId(), request.getCurrentPath());
        log.debug("path : {}", path);

        String sourceKey = path + request.getCurrentName();
        String destinationKey = path + request.getUpdateName() + "." + request.getExtension();

        updateS3Object(user, sourceKey, destinationKey, 0L);
    }

    /**
     * [ 파일 삭제 ]
     *
     * @param request filePaths
     * @param userId  user id signed in
     * @return boolean - is success delete
     * @apiNote 요청받은 경로의 파일을 삭제하는 API
     * @since 2023.08.02
     */
    @Transactional
    public boolean deleteFile(FileDeleteRequest request, Long userId) {
        AtomicBoolean allPassed = new AtomicBoolean(false);

        request.getFilePaths().forEach(path -> {
            StringBuilder filePath = new StringBuilder();
            filePath.append("dxeng/").append(location).append("/")
                    .append("user_").append(String.format("%06d", userId)).append("/").append(path);
            log.debug("filename: {}", filePath);
            try {
                boolean isObjectExist = amazonS3Client.doesObjectExist(bucket, String.valueOf(filePath));

                ListObjectsRequest listObjectsRequest = new ListObjectsRequest();
                listObjectsRequest.setBucketName(bucket);
                listObjectsRequest.setPrefix(String.valueOf(filePath));

                ObjectListing s3Objects;

                if (isObjectExist) {
                    if (path.charAt(path.length() - 1) == '/') {
                        do {
                            s3Objects = amazonS3Client.listObjects(listObjectsRequest);
                            for (S3ObjectSummary s3ObjectSummary : s3Objects.getObjectSummaries()) {
                                String key = s3ObjectSummary.getKey();
                                amazonS3Client.deleteObject(bucket, key);
                            }
                            listObjectsRequest.setMarker(s3Objects.getNextMarker());
                        } while (s3Objects.isTruncated());
                    } else {
                        amazonS3Client.deleteObject(bucket, String.valueOf(filePath));
                    }
                } else {
                    allPassed.set(false);
                    throw new EdxpApplicationException(ErrorCode.FILE_NOT_FOUND);
                }
            } catch (Exception e) {
                allPassed.set(false);
                throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, String.format("%s delete is failed", path));
            }
            allPassed.set(true);
        });

        return allPassed.get();
    }

    /**
     * [ 임시파일 저장 ]
     *
     * @param user user is signed in
     * @param saveFileName filename to change
     * @param fileName original file key
     */
    @Transactional
    public void moveFile(User user, String saveFileName, String fileName) {
        String sourceKey = String.valueOf(getPath(user.getId(), "doc_risk").append("/").append(fileName));
        String destinationKey = String.valueOf(getPath(user.getId(), "doc").append("/").append(saveFileName).append("$").append(fileName));

        final long docVolume = getVolume(user, "doc/").getOriginalVolume();

        updateS3Object(user, sourceKey, destinationKey, docVolume);
    }

    // 분석용 파일 삭제
    @Transactional
    public void deleteAnalysisFile(Long userId, String fileName, String myPath) {
        final StringBuilder s3Path = getPath(userId, myPath).append("/").append(fileName);
        boolean isObjectExist = amazonS3Client.doesObjectExist(bucket, String.valueOf(s3Path));

        if (!isObjectExist) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "File is not exist");
        }

        try {
            amazonS3Client.deleteObject(bucket, String.valueOf(s3Path));
        } catch (Exception e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Delete is failed");
        }
    }

    // 파일 경로 반환 내부 메소드
    private StringBuilder getPath(long userId, String currentPath) {
        StringBuilder path = new StringBuilder();
        path.append("dxeng").append("/").append(location).append("/").append("user_").append(String.format("%06d", userId)).append("/").append(currentPath);

        return path;
    }

    // 파일 변경 내부 메소드
    private void updateS3Object(User user, String sourceKey, String destinationKey, long volume) {
        // 파일 확인
        boolean isObjectExist = amazonS3Client.doesObjectExist(bucket, sourceKey);
        if (!isObjectExist) throw new EdxpApplicationException(ErrorCode.FILE_NOT_FOUND);

        // 파일 중복 확인
        duplicateFilenameValidation(destinationKey);

        // 용량 확인
        ObjectMetadata sourceMetadata = amazonS3Client.getObjectMetadata(new GetObjectMetadataRequest(bucket, sourceKey));
        long sourceSize = sourceMetadata.getContentLength();
        checkVolume(user, volume, sourceSize);

        CopyObjectRequest copyObjectsRequest = new CopyObjectRequest(bucket, sourceKey, bucket, destinationKey);
        amazonS3Client.copyObject(copyObjectsRequest);

        try {
            amazonS3Client.deleteObject(bucket, sourceKey);
        } catch (Exception e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Delete is failed in update");
        }
    }

    // ListObjectsRequest 반환 내부 메소드
    private ListObjectsRequest getListObjectsRequest(Long userId, String currentPath) {
        ListObjectsRequest listObjectsRequest = new ListObjectsRequest();
        listObjectsRequest.setBucketName(bucket);
        listObjectsRequest.setPrefix("dxeng" + "/" + location + "/" + "user_" + String.format("%06d", userId) + "/" + currentPath);
        
        return listObjectsRequest;
    }

    // 파일 압축 내부 메소드
    private void addFolderToZip(ZipOutputStream zipOut, String filePath) throws IOException {
        final int INPUT_STREAM_BUFFER_SIZE = 2048;
        Files.walkFileTree(Paths.get(filePath), new SimpleFileVisitor<>() {
            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                if (attrs.isSymbolicLink()) {
                    return FileVisitResult.CONTINUE;
                }

                try (FileInputStream fis = new FileInputStream(file.toFile())) {
                    Path targetFile = Paths.get(filePath).relativize(file);
                    ZipEntry zipEntry = new ZipEntry(targetFile.toString());
                    zipOut.putNextEntry(zipEntry);

                    byte[] bytes = new byte[INPUT_STREAM_BUFFER_SIZE];
                    int length;
                    while ((length = fis.read(bytes)) >= 0) {
                        zipOut.write(bytes, 0, length);
                    }
                    zipOut.closeEntry();
                }
                return FileVisitResult.CONTINUE;
            }

            @Override
            public FileVisitResult visitFileFailed(Path file, IOException exc) {
                System.err.printf("Unable to zip : %s%n%s%n", file, exc);
                return FileVisitResult.CONTINUE;
            }
        });
    }

    /**
     * == Validations ==
     */
    // 파일 경로 validation
    private void requestPathValidation(String path) {
        if (ObjectUtils.isEmpty(path)) {
            throw new EdxpApplicationException(ErrorCode.INVALID_PATH, "Path is empty");
        }

        char lastChar = path.charAt(path.length() - 1);
        if (lastChar != '/') {
            throw new EdxpApplicationException(ErrorCode.INVALID_PATH, "It is not folder");
        }

        final String rootPath = path.substring(0, path.indexOf("/"));

        if (!UPLOAD_FOLDER_LIST.contains(rootPath)) {
            throw new EdxpApplicationException(ErrorCode.INVALID_PATH);
        }
    }

    // 파일 이름 중복 validation
    private void duplicateFilenameValidation(String filePath) {
        boolean isObjectExist = amazonS3Client.doesObjectExist(bucket, String.valueOf(filePath));

        if (isObjectExist) {
            throw new EdxpApplicationException(ErrorCode.DUPLICATED_FILE_NAME);
        }
    }

    // 업로드 파일 갯수 validation
    private void uploadFileNumberValidation(FileUploadRequest request) {
        if (request.getFiles().size() > MAX_UPLOAD_FILES) {
            throw new EdxpApplicationException(ErrorCode.MAX_FILE_UPLOADED, String.format("Max file upload is %d", MAX_UPLOAD_FILES));
        }
    }

    // 업로드 스토리지용량 validation
    private void uploadVolumeValidation(User user, FileUploadRequest request) {
        final String rootPath = request.getCurrentPath().substring(0, request.getCurrentPath().indexOf("/") + 1);
        log.debug("rootPath: {}", rootPath);

        final long storageVolume = getVolume(user, rootPath).getOriginalVolume();
        final List<MultipartFile> files = request.getFiles();

        long uploadVolume = 0;
        for (MultipartFile file : files) {
            uploadVolume += file.getSize();
        }

        checkVolume(user, storageVolume, uploadVolume);
    }

    // 용량 확인 메소드
    private void checkVolume(User user, long storageVolume, long uploadVolume) {
        log.debug("storage: {}, upload: {}", storageVolume, uploadVolume);

        if (!user.isUserCharged()) {
            if (storageVolume + uploadVolume > MAX_UPLOAD_VOLUME) {
                throw new EdxpApplicationException(ErrorCode.OVER_VOLUME_UPLOADED);
            }
        } else {
            if (storageVolume + uploadVolume > MAX_UPLOAD_CHARGED_VOLUME) {
                throw new EdxpApplicationException(ErrorCode.OVER_VOLUME_UPLOADED);
            }
        }
    }
}

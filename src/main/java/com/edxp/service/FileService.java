package com.edxp.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.services.s3.transfer.Download;
import com.amazonaws.services.s3.transfer.MultipleFileDownload;
import com.amazonaws.services.s3.transfer.Transfer;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.edxp.common.utils.FileUtil;
import com.edxp.constant.ErrorCode;
import com.edxp.dto.request.*;
import com.edxp.dto.response.FileListResponse;
import com.edxp.dto.response.FileVolumeResponse;
import com.edxp.dto.response.FolderListResponse;
import com.edxp.exception.EdxpApplicationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.text.DecimalFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

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

    @Transactional(readOnly = true)
    public List<FileListResponse> getFiles(Long userId, String currentPath) {
        log.debug("path : {}", currentPath);

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
                Optional<S3ObjectSummary> latestObject = folderObjectSummaries.stream().max(Comparator.comparing(S3ObjectSummary::getLastModified));
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

    @Transactional(readOnly = true)
    public List<FolderListResponse> getFolders(Long userId, String currentPath) {
        log.debug("folderPath : {}", currentPath);

        ListObjectsRequest listObjectsRequest = getListObjectsRequest(userId, currentPath);
        ObjectListing s3Objects;

        List<FolderListResponse> folders = new ArrayList<>();

        do {
            s3Objects = amazonS3Client.listObjects(listObjectsRequest);
            for (S3ObjectSummary s3ObjectSummary : s3Objects.getObjectSummaries()) {
                String key = s3ObjectSummary.getKey();
                if (key.charAt(key.length() - 1) == '/') {
                    folders.add(FolderListResponse.from(s3ObjectSummary));
                }
            }

            listObjectsRequest.setMarker(s3Objects.getNextMarker());
        } while (s3Objects.isTruncated());

        return folders;
    }

    @Transactional(readOnly = true)
    public FileVolumeResponse getVolume(Long userId, String currentPath) {
        log.debug("folderPath : {}", currentPath);

        ListObjectsRequest listObjectsRequest = getListObjectsRequest(userId, currentPath);
        ObjectListing s3Objects;

        List<S3ObjectSummary> s3ObjectSummaries = new ArrayList<>();

        do {
            s3Objects = amazonS3Client.listObjects(listObjectsRequest);
            s3ObjectSummaries.addAll(s3Objects.getObjectSummaries());

            listObjectsRequest.setMarker(s3Objects.getNextMarker());
        } while (s3Objects.isTruncated());

        return FileVolumeResponse.from(s3ObjectSummaries);
    }

    private StringBuilder getPath (long userId, String currentPath) {
        StringBuilder path = new StringBuilder();
        path.append("dxeng/").append(location).append("/").append("user_").append(String.format("%06d", userId)).append("/").append(currentPath);

        return path;
    }

    @Transactional
    public void addFolder(Long userId, FolderAddRequest request) {
        log.debug("path : {}", getPath(userId, request.getCurrentPath()));

        StringBuilder filePath = getPath(userId, request.getCurrentPath()).append(request.getFolderName()).append("/");

        boolean isObjectExist = amazonS3Client.doesObjectExist(bucket, String.valueOf(filePath));

        if (!isObjectExist) {
            amazonS3Client.putObject(bucket, String.valueOf(filePath), new ByteArrayInputStream(new byte[0]), new ObjectMetadata());
        } else {
            throw new EdxpApplicationException(ErrorCode.DUPLICATED_FILE_NAME);
        }
    }

    @Transactional
    public void uploadFile(Long userId, FileUploadRequest request) {
        if (request.getFiles().size() > 5) throw new EdxpApplicationException(ErrorCode.MAX_FILE_UPLOADED);
        request.getFiles().forEach(file -> {
            try {
                String fileName = file.getOriginalFilename();

                log.debug("path : {}", getPath(userId, request.getCurrentPath()));

                StringBuilder filePath = getPath(userId, request.getCurrentPath()).append(fileName);

                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentType(file.getContentType());
                metadata.setContentLength(file.getSize());

                boolean isObjectExist = amazonS3Client.doesObjectExist(bucket, String.valueOf(filePath));
                if (!isObjectExist) {
                    amazonS3Client.putObject(bucket, String.valueOf(filePath), file.getInputStream(), metadata);
                } else {
                    throw new EdxpApplicationException(ErrorCode.DUPLICATED_FILE_NAME);
                }
            } catch (IOException e) {
                throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, file.getOriginalFilename() + " upload is failed.");
            }
        });
    }

    @Transactional
    public void downloadFiles(HttpServletRequest httpRequest, HttpServletResponse response, FileDownloadsRequest request, Long userId) throws IOException {
        StringBuilder userPath = new StringBuilder();
        userPath.append("dxeng/").append(location).append("/").append("user_").append(String.format("%06d", userId)).append("/");

        // 단일 파일 다운로드
        if (request.getFilePaths().size() == 1 && request.getFilePaths().get(0).charAt(request.getFilePaths().get(0).length() - 1) != '/') {
            String filePath = String.valueOf(userPath.append(request.getFilePaths().get(0)));
            String fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
            response.addHeader("Content-Disposition", "attachment; filename=" + getEncodedFileName(httpRequest, fileName));
            response.setContentType("application/octet-stream");
            S3Object object = amazonS3Client.getObject(new GetObjectRequest(bucket, filePath));

            try (S3ObjectInputStream objectInputStream = object.getObjectContent();
                 OutputStream responseOutputStream = response.getOutputStream()) {

                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = objectInputStream.read(buffer)) != -1) {
                    responseOutputStream.write(buffer, 0, bytesRead);
                }
                return;
            } catch (Exception ex) {
                throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "File download is failed.");
            }
        }

        // (1) 서버 로컬에 생성되는 디렉토리, 해당 디렉토리에 파일이 다운로드된다
        File localDirectory = new File(downloadFolder + "/" + RandomStringUtils.randomAlphanumeric(6) + "-download");
        response.addHeader("Content-Disposition", "attachment; filename=" + localDirectory.getName() + ".zip");
        try (ZipOutputStream zipOut = new ZipOutputStream(response.getOutputStream())) {
            // (2) TransferManager -> localDirectory 에 파일 다운로드
            ArrayList<Transfer> downloadList = new ArrayList<>();
            for (String path : request.getFilePaths()) {
                log.debug("path: {}", path);
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
                log.info("[" + localDirectory.getName() + "] " + decimalFormat.format(percentTransferred) + "% download progressing...");
            }
            log.info("[" + localDirectory.getName() + "] download directory from S3 success!");

            // (4) 로컬 디렉토리 -> 압축하면서 다운로드
            log.info("compressing to zip file...");
            log.debug(localDirectory.getPath());
            addFolderToZip(zipOut, localDirectory + "/" + userPath + request.getCurrentPath());
        } catch (Exception e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "File download is failed.");
        } finally {
            // (5) 로컬 디렉토리 삭제
            FileUtil.remove(localDirectory);
        }
    }

    @Transactional
    public void updateFile(FileUpdateRequest request, Long userId) {
        StringBuilder path = getPath(userId, request.getCurrentPath());
        log.debug("path : {}", path);

        String sourceKey = path + request.getCurrentName();
        String destinationKey = path + request.getUpdateName() + "." + request.getExtension();

        boolean isObjectExist = amazonS3Client.doesObjectExist(bucket, sourceKey);
        boolean isNewObjectExist = amazonS3Client.doesObjectExist(bucket, destinationKey);

        if (isNewObjectExist) {
            throw new EdxpApplicationException(ErrorCode.DUPLICATED_FILE_NAME);
        }
        if (isObjectExist) {
            CopyObjectRequest copyObjectsRequest = new CopyObjectRequest(bucket, sourceKey, bucket, destinationKey);
            amazonS3Client.copyObject(copyObjectsRequest);
        } else {
            throw new EdxpApplicationException(ErrorCode.FILE_NOT_FOUND);
        }

        try {
            amazonS3Client.deleteObject(bucket, sourceKey);
        } catch (Exception e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, " delete is failed.");
        }
    }

    @Transactional
    public boolean deleteFile(FileDeleteRequest request, Long userId) {
        AtomicBoolean allPassed = new AtomicBoolean(false);
        request.getFilePaths().forEach(path -> {
            StringBuilder filePath = new StringBuilder();
            filePath.append("dxeng/").append(location).append("/").append("user_").append(String.format("%06d", userId)).append("/").append(path);
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
                throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, path + " delete is failed.");
            }
            allPassed.set(true);
        });
        return allPassed.get();
    }

    private ListObjectsRequest getListObjectsRequest(Long userId, String currentPath) {
        ListObjectsRequest listObjectsRequest = new ListObjectsRequest();
        listObjectsRequest.setBucketName(bucket);
        listObjectsRequest.setPrefix("dxeng/" + location + "/" + "user_" + String.format("%06d", userId) + "/" + currentPath);
        return listObjectsRequest;
    }

    private String getEncodedFileName(HttpServletRequest httpRequest, String fileName) {
        String header = httpRequest.getHeader("User-Agent");
        if (header.contains("Edge")|| header.contains("MSIE") || header.contains("Trident")) {
            return URLEncoder.encode(fileName, StandardCharsets.UTF_8).replaceAll("\\+", "%20");
        } else if (header.contains("Chrome") || header.contains("Opera") || header.contains("Firefox")) {
            return new String(fileName.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1);
        } else if (header.contains("Postman")) {
            String test = new String(fileName.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1);
            log.debug(test);
            return test;
        } else {
            return  "downloaded_file";
        }
    }

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
}

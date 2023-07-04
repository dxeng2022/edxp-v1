package com.edxp.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.services.s3.transfer.MultipleFileDownload;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferProgress;
import com.edxp.common.utils.FileUtil;
import com.edxp.constant.ErrorCode;
import com.edxp.dto.request.*;
import com.edxp.dto.response.FileListResponse;
import com.edxp.dto.response.FolderListResponse;
import com.edxp.exception.EdxpApplicationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

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

    @Transactional(readOnly = true)
    public List<FileListResponse> getFiles(Long userId, String currentPath) {
        ListObjectsRequest listObjectsRequest = new ListObjectsRequest();
        listObjectsRequest.setBucketName(bucket);
        listObjectsRequest.setPrefix("user_" + String.format("%07d", userId) + "/" + currentPath);
        listObjectsRequest.setDelimiter("/");
        log.info("path : {}", currentPath);

        ObjectListing s3Objects;

        List<FileListResponse> files = new ArrayList<>();

        do {
            s3Objects = amazonS3Client.listObjects(listObjectsRequest);
            for (String commonPrefix : s3Objects.getCommonPrefixes()) { // prefix 경로의 디렉토리를 저장 (ex. v1/)
                files.add(FileListResponse.from(commonPrefix));
            }

            s3Objects = amazonS3Client.listObjects(listObjectsRequest);
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
        ListObjectsRequest listObjectsRequest = new ListObjectsRequest();
        listObjectsRequest.setBucketName(bucket);
        listObjectsRequest.setPrefix("user_" + String.format("%07d", userId) + "/" + currentPath);
        log.info("folderPath : {}", currentPath);

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

    @Transactional
    public void addFolder(Long userId, FolderAddRequest request) {
        StringBuilder path = new StringBuilder();
        path.append("user_").append(String.format("%07d", userId)).append("/").append(request.getCurrentPath());
        log.info("path : {}", path);

        StringBuilder filePath = path.append(request.getFolderName()).append("/");

        boolean isObjectExist = amazonS3Client.doesObjectExist(bucket, String.valueOf(filePath));
        if (!isObjectExist) {
            amazonS3Client.putObject(bucket, String.valueOf(filePath), new ByteArrayInputStream(new byte[0]), new ObjectMetadata());
        } else {
            throw new EdxpApplicationException(ErrorCode.DUPLICATED_FILE_NAME);
        }
    }

    @Transactional
    public void uploadFile(Long userId, FileUploadRequest request) {
        request.getFiles().forEach(file -> {
            try {
                String fileName = file.getOriginalFilename();

                StringBuilder path = new StringBuilder();
                path.append("user_").append(String.format("%07d", userId)).append("/").append(request.getCurrentPath());
                log.info("path : {}", path);

                StringBuilder filePath = path.append(fileName);

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
                throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "File upload is failed.");
            }
        });
    }

//    @Transactional
//    public InputStreamResource downloadFile(FileDownloadRequest request) {
//        log.info("filename: {}", request.getFilePath());
//        S3Object object = amazonS3Client.getObject(new GetObjectRequest(bucket, request.getFilePath()));
//        S3ObjectInputStream objectInputStream = object.getObjectContent();
//
//        boolean isObjectExist = amazonS3Client.doesObjectExist(bucket, String.valueOf(request.getFilePath()));
//        if (isObjectExist) {
//            try {
//                return new InputStreamResource(objectInputStream);
//            } catch (Exception e) {
//                throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "File download is failed.");
//            }
//        } else {
//            throw new EdxpApplicationException(ErrorCode.FILE_NOT_FOUND);
//        }
//    }

    @Transactional
    public InputStreamResource downloadFile(FileDownloadRequest request) {
        log.info("filename: {}", request.getFilePath());
        S3Object object = amazonS3Client.getObject(new GetObjectRequest(bucket, request.getFilePath()));
        S3ObjectInputStream objectInputStream = object.getObjectContent();

        boolean isObjectExist = amazonS3Client.doesObjectExist(bucket, String.valueOf(request.getFilePath()));
        if (isObjectExist) {
            try {
                return new InputStreamResource(objectInputStream);
            } catch (Exception e) {
                throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "File download is failed.");
            }
        } else {
            throw new EdxpApplicationException(ErrorCode.FILE_NOT_FOUND);
        }
    }

    @Transactional
    public FileSystemResource downloadFiles(FileDownloadsRequest request) throws InterruptedException, ZipException, IOException {
        log.info("filename: {}", request.getFilePath());
        // (1)
        // 서버 로컬에 생성되는 디렉토리, 해당 디렉토리에 파일이 다운로드된다
        File localDirectory = new File(downloadFolder + RandomStringUtils.randomAlphanumeric(6) + "-s3-download");
        // 서버 로컬에 생성되는 zip 파일
        ZipFile zipFile = new ZipFile(downloadFolder +RandomStringUtils.randomAlphanumeric(6) + "-s3-download.zip");

        try {
            // (2)
            // TransferManager -> localDirectory 에 파일 다운로드
            MultipleFileDownload downloadDirectory = transferManager.downloadDirectory(bucket, request.getFilePath(), localDirectory);

            // (3)
            // 다운로드 상태 확인
            log.info("[" + request.getFilePath() + "] download progressing... start");
            DecimalFormat decimalFormat = new DecimalFormat("##0.00");
            while (!downloadDirectory.isDone()) {
                Thread.sleep(1000);
                TransferProgress progress = downloadDirectory.getProgress();
                double percentTransferred = progress.getPercentTransferred();
                log.info("[" + request.getFilePath() + "] " + decimalFormat.format(percentTransferred) + "% download progressing...");
            }
            log.info("[" + request.getFilePath() + "] download directory from S3 success!");

            // (4)
            // 로컬 디렉토리 -> 로컬 zip 파일에 압축
            log.info("compressing to zip file...");
            zipFile.addFolder(new File(localDirectory + "/" + request.getFilePath() ));
        } finally {
            // (5)
            // 로컬 디렉토리 삭제
            FileUtil.remove(localDirectory);
        }

        // (6)
        // 파일 Resource 리턴
        log.info("zipPath: {}", zipFile.getFile().getPath());
        return new FileSystemResource(zipFile.getFile().getPath());
    }

    @Transactional
    public boolean deleteFile(FileDeleteRequest request) {
        String filePath = request.getFilePath();
        log.info("path: {}", filePath);
        try {
            boolean isObjectExist = amazonS3Client.doesObjectExist(bucket, filePath);
            if (isObjectExist) {
                amazonS3Client.deleteObject(bucket, filePath);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "File delete is failed.");
        }
    }
}

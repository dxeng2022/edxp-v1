package com.edxp.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.*;
import com.edxp.constant.ErrorCode;
import com.edxp.dto.request.FileDeleteRequest;
import com.edxp.dto.request.FileDownloadRequest;
import com.edxp.dto.request.FileFolderRequest;
import com.edxp.dto.request.FileUploadRequest;
import com.edxp.dto.response.FileListResponse;
import com.edxp.exception.EdxpApplicationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class FileService {
    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

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
                System.out.println(commonPrefix);
                files.add(FileListResponse.from(commonPrefix));
            }

            s3Objects = amazonS3Client.listObjects(listObjectsRequest);
            for (S3ObjectSummary s3ObjectSummary : s3Objects.getObjectSummaries()) {
                System.out.println(s3ObjectSummary.toString());
                String key = s3ObjectSummary.getKey();
                if (key.charAt(key.length() - 1) != '/') {
                    files.add(FileListResponse.from(s3ObjectSummary));
                }
            }
            listObjectsRequest.setMarker(s3Objects.getNextMarker());
        } while (s3Objects.isTruncated());

        return files;
    }

    @Transactional
    public void addFolder(Long userId, FileFolderRequest request) {
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

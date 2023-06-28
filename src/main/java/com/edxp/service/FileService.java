package com.edxp.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ListObjectsRequest;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.edxp.constant.ErrorCode;
import com.edxp.domain.FileDetailEntity;
import com.edxp.dto.request.FileDeleteRequest;
import com.edxp.dto.request.FileUploadRequest;
import com.edxp.dto.response.FileListResponse;
import com.edxp.exception.EdxpApplicationException;
import com.edxp.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class FileService {
    private final FileRepository fileRepository;
    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Transactional(readOnly = true)
    public List<FileListResponse> getFiles(Long userId, String currentPath) {
        ListObjectsRequest listObjectsRequest = new ListObjectsRequest();
        listObjectsRequest.setBucketName(bucket);
        listObjectsRequest.setPrefix("user_" + String.format("%07d", userId) + "/" + currentPath);

        ObjectListing s3Objects;

        List<FileListResponse> files = new ArrayList<>();

        do {
            s3Objects = amazonS3Client.listObjects(listObjectsRequest);
            for (S3ObjectSummary s3ObjectSummary : s3Objects.getObjectSummaries()) {
                files.add(FileListResponse.from(s3ObjectSummary));
            }
            listObjectsRequest.setMarker(s3Objects.getNextMarker());
        } while (s3Objects.isTruncated());

        return files;
    }

    @Transactional
    public void uploadFile(Long userId, FileUploadRequest request) {
        try {
            StringBuilder fileName = new StringBuilder();
            UUID uuid = UUID.randomUUID();
            LocalDateTime now = LocalDateTime.now();
            String fileOriginalName = request.getFile().getOriginalFilename();
            assert fileOriginalName != null;
            String extension = fileOriginalName.substring(fileOriginalName.lastIndexOf("."));
            fileName.append(now.getYear())
                    .append(String.format("%02d", now.getMonthValue()))
                    .append(String.format("%02d", now.getDayOfMonth()))
                    .append("_").append(uuid).append(extension);
            log.info("fileName : {}", fileName);

            StringBuilder path = new StringBuilder();
            path.append("user_").append(String.format("%07d", userId)).append("/").append(request.getCurrentPath());
            log.info("path : {}", path);

            StringBuilder filePath = path.append(fileName);

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(request.getFile().getContentType());
            metadata.setContentLength(request.getFile().getSize());

            amazonS3Client.putObject(bucket, String.valueOf(filePath), request.getFile().getInputStream(), metadata);
        } catch (IOException e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "File upload is failed");
        }
    }

    @Transactional
    public void deleteFile(FileDeleteRequest request) {
        String keyName = request.getFilePath();
        try {
            boolean isObjectExist = amazonS3Client.doesObjectExist(bucket, keyName);
            if (isObjectExist) {
                amazonS3Client.deleteObject(bucket, keyName);
            } else {
                ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            log.debug("Delete File failed", e);
        }
    }
}

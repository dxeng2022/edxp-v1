package com.edxp.dto.response;

import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.edxp.dto.FileDetail;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.sql.Timestamp;
import java.util.Date;

@Getter
@AllArgsConstructor
public class FileListResponse {
    private String fileName;
    private Long fileSize;
    private String filePath;
    private Date registeredAt;

    public static FileListResponse from(S3ObjectSummary s3ObjectSummary) {
        String key = s3ObjectSummary.getKey();
        String fileName = key.substring(key.lastIndexOf("/") + 1);

        return new FileListResponse(
                fileName,
                s3ObjectSummary.getSize(),
                s3ObjectSummary.getKey(),
                s3ObjectSummary.getLastModified()
        );
    }
}

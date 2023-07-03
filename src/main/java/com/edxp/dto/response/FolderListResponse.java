package com.edxp.dto.response;

import com.amazonaws.services.s3.model.S3ObjectSummary;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FolderListResponse {
    private String fileName;
    private String filePath;

    public static FolderListResponse from(S3ObjectSummary s3ObjectSummary) {
        String filePath = s3ObjectSummary.getKey().substring(s3ObjectSummary.getKey().indexOf("/") + 1);
        String fileName = filePath.split("/")[filePath.split("/").length - 1];

        return new FolderListResponse(
                fileName,
                filePath
        );
    }
}

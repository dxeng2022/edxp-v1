package com.edxp.s3file.dto.response;

import com.amazonaws.services.s3.model.S3ObjectSummary;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FileFolderListResponse {
    private String folderName;
    private String folderPath;

    public static FileFolderListResponse from(S3ObjectSummary s3ObjectSummary) {
        int startIdx = s3ObjectSummary.getKey().indexOf("user");
        String folderPath = s3ObjectSummary.getKey().substring(s3ObjectSummary.getKey().indexOf("/", startIdx) + 1);
        String fileName = folderPath.split("/")[folderPath.split("/").length - 1];

        return new FileFolderListResponse(
                fileName,
                folderPath
        );
    }
}

package com.edxp.dto.response;

import com.amazonaws.services.s3.model.S3ObjectSummary;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

@Getter
@AllArgsConstructor
public class FileListResponse {
    private String fileName;
    private String extension;
    private Long fileSize;
    private String filePath;
    private String registeredAt;

    public static FileListResponse from(S3ObjectSummary s3ObjectSummary) {
        String filePath = s3ObjectSummary.getKey();
        String fileName = "";
        String extension = "";
        if (filePath.charAt(filePath.length() - 1) == '/') {
            fileName = filePath.split("/")[filePath.split("/").length - 1];
            extension = "폴더";
        } else {
            fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
            extension = fileName.substring(fileName.lastIndexOf(".") + 1);
        }
        Long fileSize = s3ObjectSummary.getSize();
        Calendar s3Date = Calendar.getInstance();
        s3Date.setTime(s3ObjectSummary.getLastModified());
        s3Date.add(Calendar.HOUR, 9);
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy. MM. dd. a hh:mm:ss");
        String registeredAt = dateFormat.format(s3ObjectSummary.getLastModified());

        return new FileListResponse(
                fileName,
                extension,
                fileSize,
                filePath,
                registeredAt
        );
    }
}

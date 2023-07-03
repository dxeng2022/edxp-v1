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
    private String fileSize;
    private String filePath;
    private String registeredAt;

    public static FileListResponse from(String commonPrefix) {
        String fileName = commonPrefix.split("/")[commonPrefix.split("/").length - 1];
        String extension = "폴더";
        String fileSize = "-";
        String filePath = commonPrefix.substring(commonPrefix.indexOf("/") + 1);
        String registeredAt = "-";

        return new FileListResponse(
                fileName,
                extension,
                fileSize,
                filePath,
                registeredAt
        );
    }

    public static FileListResponse from(S3ObjectSummary s3ObjectSummary) {
        String fileSize = getSizeFormat(s3ObjectSummary.getSize());
        String registeredAt = getDateFormat(s3ObjectSummary.getLastModified());
        String filePath = s3ObjectSummary.getKey().substring(s3ObjectSummary.getKey().indexOf("/") + 1);
        String fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1);

        return new FileListResponse(
                fileName,
                extension,
                fileSize,
                filePath,
                registeredAt
        );
    }

    private static String getDateFormat(Date date) {
        Calendar s3Date = Calendar.getInstance();
        s3Date.setTime(date);
        s3Date.add(Calendar.HOUR, 9);
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy. MM. dd. a hh:mm:ss");
        return dateFormat.format(date);
    }

    private static String getSizeFormat(Long size) {
        StringBuilder fileSize = new StringBuilder();
        long oneByte = 1024;
        if (size == 0) {
            fileSize.append("-");
        } else if (0 < size && size < Math.pow(oneByte, 2)) {
            fileSize.append(String.format("%.1f", ((double) size) / 1024)).append(" KB");
        } else if (Math.pow(oneByte, 2) <= size && size < Math.pow(oneByte, 3)) {
            fileSize.append(String.format("%.1f", ((double) size) / Math.pow(1024, 2))).append(" MB");
        } else if (Math.pow(oneByte, 3) <= size && size < Math.pow(oneByte, 4)) {
            fileSize.append(String.format("%.1f", ((double) size) / Math.pow(1024, 3))).append(" GB");
        } else if (Math.pow(oneByte, 4) <= size) {
            fileSize.append(String.format("%.1f", ((double) size) / Math.pow(1024, 4))).append(" TB");
        } else {
            fileSize.append(size).append(" byte");
        }
        return fileSize.toString();
    }
}

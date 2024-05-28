package com.edxp.s3file.dto.response;

import com.amazonaws.services.s3.model.S3ObjectSummary;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import static com.edxp._core.common.utils.DateUtil.getDateFormat;
import static com.edxp._core.common.utils.FileUtil.getSizeFormat;

@Getter
@AllArgsConstructor
public class FileListResponse {
    private String fileName;
    private String fileSize;
    private String filePath;
    private String extension;
    private String registeredAt;
    private long originalFileSize;
    private LocalDateTime originalRegisteredAt;

    public static FileListResponse from(String commonPrefix, String folderPath, Date latModified, long folderSize) {
        String fileName = commonPrefix.split("/")[commonPrefix.split("/").length - 1];
        String fileSize = getSizeFormat(folderSize);
        String extension = "폴더";
        String registeredAt = getDateFormat(latModified);
        LocalDateTime originalRegisteredAt = latModified.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

        return new FileListResponse(
                fileName,
                fileSize,
                folderPath,
                extension,
                registeredAt,
                folderSize,
                originalRegisteredAt
        );
    }

    public static FileListResponse from(S3ObjectSummary s3ObjectSummary) {
        long originalFileSize = s3ObjectSummary.getSize();
        String fileSize = getSizeFormat(s3ObjectSummary.getSize());
        LocalDateTime originalRegisteredAt = s3ObjectSummary.getLastModified().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        String registeredAt = getDateFormat(s3ObjectSummary.getLastModified());
        int startIdx = s3ObjectSummary.getKey().indexOf("user");
        String filePath = s3ObjectSummary.getKey().substring(s3ObjectSummary.getKey().indexOf("/", startIdx) + 1);
        String fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1);

        return new FileListResponse(
                fileName,
                fileSize,
                filePath,
                extension,
                registeredAt,
                originalFileSize,
                originalRegisteredAt
        );
    }
}

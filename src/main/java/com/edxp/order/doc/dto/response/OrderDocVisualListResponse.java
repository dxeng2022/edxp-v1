package com.edxp.order.doc.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDocVisualListResponse {
    private String originalFilename;
    private String originalFilePath;
    private String fileName;
    private String fileSize;
    private String filePath;
    private String extension;
    private String registeredAt;
    private String extractedDate;
    private long originalFileSize;
    private LocalDateTime originalRegisteredAt;

    public static OrderDocVisualListResponse of(
            String originalFilename,
            String originalFilePath,
            String fileName,
            String fileSize,
            String filePath,
            String extension,
            String registeredAt,
            String extractedDate,
            long originalFileSize,
            LocalDateTime originalRegisteredAt
    ) {
        return new OrderDocVisualListResponse(
                originalFilename,
                originalFilePath,
                fileName,
                fileSize,
                filePath,
                extension,
                registeredAt,
                extractedDate,
                originalFileSize,
                originalRegisteredAt
        );
    }
}

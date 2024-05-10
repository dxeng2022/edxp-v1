package com.edxp.order.doc.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDocResponse {
    private Long id;
    private Long userId;
    private String originalFileName;
    private String originalFilePath;
    private Long originalFileSize;
    private String originalFileVolume;
    private String orderFileName;
    private Long orderFileSize;
    private String orderFileVolume;
    private String parsedDate;
    private String extractedDate;
    private String deletedAt;

    public static OrderDocResponse of(
            Long id,
            Long userId,
            String originalFileName,
            String originalFilePath,
            Long originalFileSize,
            String originalFileVolume,
            String orderFileName,
            Long orderFileSize,
            String orderFileVolume,
            String parsedDate,
            String extractedDate,
            String deletedAt
    ) {
        return new OrderDocResponse(
                id,
                userId,
                originalFileName,
                originalFilePath,
                originalFileSize,
                originalFileVolume,
                orderFileName,
                orderFileSize,
                orderFileVolume,
                parsedDate,
                extractedDate,
                deletedAt
        );
    }
}

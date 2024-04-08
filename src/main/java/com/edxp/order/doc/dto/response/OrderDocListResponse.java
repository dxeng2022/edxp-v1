package com.edxp.order.doc.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDocListResponse {
    private Long id;
    private Long userId;
    private String originalFileName;
    private Long originalFileSize;
    private String originalFileVolume;
    private String orderFileName;
    private Long orderFileSize;
    private String orderFileVolume;
    private String parsedDate;
    private String extractedDate;
    private String deletedAt;

    public static OrderDocListResponse of(
            Long id,
            Long userId,
            String originalFileName,
            Long originalFileSize,
            String originalFileVolume,
            String orderFileName,
            Long orderFileSize,
            String orderFileVolume,
            String parsedDate,
            String extractedDate,
            String deletedAt
    ) {
        return new OrderDocListResponse(
                id,
                userId,
                originalFileName,
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

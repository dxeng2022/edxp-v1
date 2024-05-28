package com.edxp.order.doc.dto.response;

import com.edxp.s3file.dto.response.FileListResponse;
import lombok.*;

import java.time.LocalDateTime;

import static com.edxp._core.common.utils.DateUtil.parseStringToLocalDateTime;

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
    private LocalDateTime originalExtractedDate;

    private static OrderDocVisualListResponse of(
            String originalFilename,
            String originalFilePath,
            String fileName,
            String fileSize,
            String filePath,
            String extension,
            String registeredAt,
            String extractedDate,
            long originalFileSize,
            LocalDateTime originalRegisteredAt,
            LocalDateTime originalExtractedDate
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
                originalRegisteredAt,
                originalExtractedDate
        );
    }

    public static OrderDocVisualListResponse from(FileListResponse resultFile, OrderDocResponse order) {
        LocalDateTime originalExtractedDate = parseStringToLocalDateTime(order.getExtractedDate());

        return OrderDocVisualListResponse.of(
                order.getOriginalFileName(),
                order.getOriginalFilePath(),
                resultFile.getFileName(),
                resultFile.getFileSize(),
                resultFile.getFilePath(),
                resultFile.getExtension(),
                resultFile.getRegisteredAt(),
                order.getExtractedDate(),
                resultFile.getOriginalFileSize(),
                resultFile.getOriginalRegisteredAt(),
                originalExtractedDate
        );
    }
}

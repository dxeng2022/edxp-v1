package com.edxp.order.doc.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDocRequest {
    private String originalFileName;
    private Long originalFileSize;
    private String orderFileName;
    private Long orderFileSize;

    public static OrderDocRequest of(
            String originalFileName,
            Long originalFileSize,
            String orderFileName,
            Long orderFileSize
    ) {
        return new OrderDocRequest(
                originalFileName,
                originalFileSize,
                orderFileName,
                orderFileSize
        );
    }
}

package com.edxp.order.doccross.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDocCrossRequest {
    private String filename;
    private String filePath;

    public static OrderDocCrossRequest of(String filename, String filePath) {
        return new OrderDocCrossRequest(filename, filePath);
    }
}

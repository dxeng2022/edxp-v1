package com.edxp.order.doc.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDocSaveRequest {
    private String saveFileName;
    private String fileName;
}

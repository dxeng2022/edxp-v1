package com.edxp.order.doc.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OrderDocRiskRequest {
    private String fileName;
    private String fileLocation;
}

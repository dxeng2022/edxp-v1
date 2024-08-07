package com.edxp.order.doc.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
public class OrderDocCountResponse {
    private Integer userParsingCount;
    private Long parsingCount;
    private Integer userExtractCount;
    private Long extractCount;
}

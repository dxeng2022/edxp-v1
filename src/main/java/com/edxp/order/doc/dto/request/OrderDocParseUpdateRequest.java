package com.edxp.order.doc.dto.request;

import com.edxp.order.doc.model.ParsedDocument;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDocParseUpdateRequest {
    private String fileName;
    private List<ParsedDocument> documents;
}

package com.edxp.order.doc.dto.response;

import com.edxp.order.doc.model.ParsedDocument;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDocParseResponse {
    private List<ParsedDocument> documents;
    private int allCounts;

    public static OrderDocParseResponse of(
            List<ParsedDocument> documents,
            int allCounts
    ) {
        return new OrderDocParseResponse(
                documents,
                allCounts
        );
    }

    public static OrderDocParseResponse from(List<ParsedDocument> documents) {
        return OrderDocParseResponse.of(documents, documents.size());
    }
}

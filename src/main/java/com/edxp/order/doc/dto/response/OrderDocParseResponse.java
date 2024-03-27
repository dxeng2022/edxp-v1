package com.edxp.order.doc.dto.response;

import com.edxp.order.doc.model.ParsedDocument;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

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
        final List<ParsedDocument> newDocuments = documents.stream().peek(it -> {
            if (it.getSection().equals("")) {
                it.setSection("-");
            }
        }).collect(Collectors.toList());

        return OrderDocParseResponse.of(newDocuments, documents.size());
    }
}

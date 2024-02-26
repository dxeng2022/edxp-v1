package com.edxp.dto.response;

import com.edxp.order.doc.domain.ParsedDocument;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VisualizationDocParseResponse {
    private List<ParsedDocument> documents;
    private int allCounts;

    public static VisualizationDocParseResponse of(
            List<ParsedDocument> documents,
            int allCounts
    ) {
        return new VisualizationDocParseResponse(
                documents,
                allCounts
        );
    }

    public static VisualizationDocParseResponse from(List<ParsedDocument> documents) {
        return VisualizationDocParseResponse.of(documents, documents.size());
    }
}

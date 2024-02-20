package com.edxp.dto.response;

import com.edxp.domain.doc.ParsedDocument;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VisualizationDocRiskResponse {
    private List<ParsedDocument> documents;
    private List<ParsedDocument> onlyRisks;
    private int allCounts;
    private int riskCounts;

    public static VisualizationDocRiskResponse of(
            List<ParsedDocument> documents,
            List<ParsedDocument> onlyRisks,
            int allCounts,
            int riskCounts
    ) {
        return new VisualizationDocRiskResponse(
                documents,
                onlyRisks,
                allCounts,
                riskCounts
        );
    }

    public static VisualizationDocRiskResponse from(List<ParsedDocument> documents) {
        List<ParsedDocument> onlyRisks = documents.stream().filter(
                item -> item.getLabel().equals("Risk")).collect(Collectors.toList()
        );
        return VisualizationDocRiskResponse.of(documents, onlyRisks, documents.size(), onlyRisks.size());
    }
}

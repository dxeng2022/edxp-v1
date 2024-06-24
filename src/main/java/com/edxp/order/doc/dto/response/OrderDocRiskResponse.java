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
public class OrderDocRiskResponse {
    private String filename;
    private List<ParsedDocument> documents;
    private List<ParsedDocument> onlyRisks;
    private int allCounts;
    private int riskCounts;

    public static OrderDocRiskResponse of(
            String filename,
            List<ParsedDocument> documents,
            List<ParsedDocument> onlyRisks,
            int allCounts,
            int riskCounts
    ) {
        return new OrderDocRiskResponse(
                filename,
                documents,
                onlyRisks,
                allCounts,
                riskCounts
        );
    }

    public static OrderDocRiskResponse from(String filename, List<ParsedDocument> documents) {
        final List<ParsedDocument> newDocuments = documents.stream().peek(it -> {
            if (it.getSection().equals("")) {
                it.setSection("-");
            }
        }).collect(Collectors.toList());

        final List<ParsedDocument> onlyRisks = documents.stream().filter(
                item -> item.getLabel().equals("Risk")).collect(Collectors.toList()
        );

        return OrderDocRiskResponse.of(filename, newDocuments, onlyRisks, documents.size(), onlyRisks.size());
    }
}

package com.edxp.order.doccross.converter;

import com.edxp._core.common.annotation.Converter;
import com.edxp.order.doccross.dto.OrderDocCrossResponse;
import com.edxp.order.doccross.model.CrossValidationDocument;
import com.edxp.order.doccross.model.CrossValidationDocumentCsv;
import com.edxp.order.doccross.model.CrossValidationVisualization;
import com.edxp.order.doccross.model.SimilarSentence;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Converter
public class OrderDocCrossConverter {
    public List<CrossValidationDocument> documentsToReturnDocument(List<CrossValidationDocumentCsv> documents) {
        return documents.stream().map(document -> CrossValidationDocument.of(
                document.getSentenceId(),
                document.getPart(),
                document.getProperty(),
                document.getValue(),
                document.getSentence(),
                document.getPartNodeInfo(),
                document.getPartNode(),
                document.getPropNodeInfo(),
                document.getPropNode(),
                document.getUnitNodeInfo(),
                document.getUnitNode(),
                document.getValueModifierInfo(),
                document.getValueModifierNode(),
                document.getSimilarPartSentenceIds(),
                document.getPartSimilarities(),
                document.getSimilarPropSentenceIds(),
                document.getPropSimilarities(),
                document.getSimilarModifierIds(),
                document.getModifierSimilarities(),
                document.getSimilarUnitIds(),
                document.getUnitSimilarities(),
                document.getSimilarValueSentenceIds(),
                document.getValueSimilarities(),
                document.getFinalSimilarSentenceIds(),
                document.getFinalSimilarities()
        ))
        .collect(Collectors.toList());
    }

    public List<CrossValidationVisualization> documentToVisualization(List<CrossValidationDocumentCsv> documents) {
        return documents.stream()
                .map(document -> CrossValidationVisualization.of(
                        document.getSentenceId(),
                        document.getSentence(),
                        document.getPart(),
                        document.getProperty(),
                        document.getValue(),
                        createSimilarSentences(documents, document.getSimilarPartSentenceIds(), document.getPartSimilarities()),
                        createSimilarSentences(documents, document.getSimilarPropSentenceIds(), document.getPropSimilarities()),
                        createSimilarSentences(documents, document.getSimilarValueSentenceIds(), document.getValueSimilarities()),
                        createSimilarSentences(documents, document.getFinalSimilarSentenceIds(), document.getFinalSimilarities())
                ))
                .filter(visualization -> !visualization.getSimilarPartSentences().isEmpty() ||
                        !visualization.getSimilarPropSentences().isEmpty() ||
                        !visualization.getSimilarValueSentences().isEmpty())
                .collect(Collectors.toList());
    }

    private List<SimilarSentence> createSimilarSentences(List<CrossValidationDocumentCsv> documents, List<Integer> ids, List<Double> similarities) {
        List<SimilarSentence> similarSentences = new ArrayList<>();

        for (int index = 0; index < ids.size(); index++) {
            int similarSentenceId = ids.get(index);
            CrossValidationDocumentCsv similarDocument = documents.stream()
                    .filter(document -> document.getSentenceId() == similarSentenceId)
                    .findFirst()
                    .orElse(null);

            if (similarDocument != null) {
                similarSentences.add(SimilarSentence.of(similarSentenceId, similarities.get(index)));
            }
        }

        return similarSentences;
    }

    public OrderDocCrossResponse toResponse(
            List<CrossValidationDocument> document,
            List<CrossValidationVisualization> crossValidationVisualizations
    ) {
        return OrderDocCrossResponse.of(document, crossValidationVisualizations);
    }
}

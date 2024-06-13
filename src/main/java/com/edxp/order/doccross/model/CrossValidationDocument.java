package com.edxp.order.doccross.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrossValidationDocument {
    private int sentenceId;
    private String part;
    private String property;
    private String value;
    private String sentence;
    private String partNodeInfo;
    private String partNode;
    private String propNodeInfo;
    private String propNode;
    private String unitNodeInfo;
    private String unitNode;
    private String valueModifierInfo;
    private String valueModifierNode;
    private List<Integer> similarPartSentenceIds;
    private List<Double> partSimilarities;
    private List<Integer> similarPropSentenceIds;
    private List<Double> propSimilarities;
    private List<Integer> similarModifierIds;
    private List<Double> modifierSimilarities;
    private List<Integer> similarUnitIds;
    private List<Double> unitSimilarities;
    private List<Integer> similarValueSentenceIds;
    private List<Double> valueSimilarities;
    private List<Integer> finalSimilarSentenceIds;
    private List<Double> finalSimilarities;

    public static CrossValidationDocument of(
            int sentenceId,
            String part,
            String property,
            String value,
            String sentence,
            String partNodeInfo,
            String partNode,
            String propNodeInfo,
            String propNode,
            String unitNodeInfo,
            String unitNode,
            String valueModifierInfo,
            String valueModifierNode,
            List<Integer> similarPartSentenceIds,
            List<Double> partSimilarities,
            List<Integer> similarPropSentenceIds,
            List<Double> propSimilarities,
            List<Integer> similarModifierIds,
            List<Double> modifierSimilarities,
            List<Integer> similarUnitIds,
            List<Double> unitSimilarities,
            List<Integer> similarValueSentenceIds,
            List<Double> valueSimilarities,
            List<Integer> finalSimilarSentenceIds,
            List<Double> finalSimilarities
    ) {
        return new CrossValidationDocument (
            sentenceId,
            part,
            property,
            value,
            sentence,
            partNodeInfo,
            partNode,
            propNodeInfo,
            propNode,
            unitNodeInfo,
            unitNode,
            valueModifierInfo,
            valueModifierNode,
            similarPartSentenceIds,
            partSimilarities,
            similarPropSentenceIds,
            propSimilarities,
            similarModifierIds,
            modifierSimilarities,
            similarUnitIds,
            unitSimilarities,
            similarValueSentenceIds,
            valueSimilarities,
            finalSimilarSentenceIds,
            finalSimilarities
        );
    }
}

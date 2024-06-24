package com.edxp.order.doccross.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CrossValidationVisualization {
    private int sentenceId;
    private String sentence;
    private String part;
    private String property;
    private String value;
    private List<SimilarSentence> similarPartSentences;
    private List<SimilarSentence> similarPropSentences;
    private List<SimilarSentence> similarValueSentences;
    private List<SimilarSentence> similarFinalSentences;

    public static CrossValidationVisualization of(int sentenceId, String sentence, String part, String property, String value, List<SimilarSentence> similarPartSentences, List<SimilarSentence> similarPropSentences, List<SimilarSentence> similarValueSentences, List<SimilarSentence> similarFinalSentences) {
        return new CrossValidationVisualization (
                sentenceId,
                sentence,
                part,
                property,
                value,
                similarPartSentences,
                similarPropSentences,
                similarValueSentences,
                similarFinalSentences
        );
    }
}

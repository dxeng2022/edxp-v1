package com.edxp.order.doccross.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SimilarSentence {
    private Integer sentenceId;
    private Double similarity;

    public static SimilarSentence of(Integer sentenceId, Double similarity) {
        return new SimilarSentence(sentenceId, similarity);
    }
}

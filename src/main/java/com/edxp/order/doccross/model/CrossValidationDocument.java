package com.edxp.order.doccross.model;

import com.edxp._core.common.serializer.CustomStringToListDeserializer;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@ToString
@Data
public class CrossValidationDocument {
    @JsonProperty("sentence id")
    private int sentenceId;

    @JsonProperty("part")
    private String part;

    @JsonProperty("property")
    private String property;

    @JsonProperty("value")
    private String value;

    @JsonProperty("sentence")
    private String sentence;

    @JsonProperty("part node info")
    private String partNodeInfo;

    @JsonProperty("part node")
    private String partNode;

    @JsonProperty("prop node info")
    private String propNodeInfo;

    @JsonProperty("prop node")
    private String propNode;

    @JsonProperty("unit node info")
    private String unitNodeInfo;

    @JsonProperty("unit node")
    private String unitNode;

    @JsonProperty("value modifier info")
    private String valueModifierInfo;

    @JsonProperty("value modifier node")
    private String valueModifierNode;

    @JsonProperty("similar part sentence id")
    @JsonDeserialize(using = CustomStringToListDeserializer.class)
    private List<Integer> similarPartSentenceIds;

    @JsonProperty("part similarity")
    @JsonDeserialize(using = CustomStringToListDeserializer.class)
    private List<Double> partSimilarities;

    @JsonProperty("similar prop sentence id")
    @JsonDeserialize(using = CustomStringToListDeserializer.class)
    private List<Integer> similarPropSentenceIds;

    @JsonProperty("prop similarity")
    @JsonDeserialize(using = CustomStringToListDeserializer.class)
    private List<Double> propSimilarities;

    @JsonProperty("similar modifier id")
    @JsonDeserialize(using = CustomStringToListDeserializer.class)
    private List<Integer> similarModifierIds;

    @JsonProperty("modifier similarity")
    @JsonDeserialize(using = CustomStringToListDeserializer.class)
    private List<Double> modifierSimilarities;

    @JsonProperty("similar unit id")
    @JsonDeserialize(using = CustomStringToListDeserializer.class)
    private List<Integer> similarUnitIds;

    @JsonProperty("unit similarity")
    @JsonDeserialize(using = CustomStringToListDeserializer.class)
    private List<Double> unitSimilarities;

    @JsonProperty("similar value sentence id")
    @JsonDeserialize(using = CustomStringToListDeserializer.class)
    private List<Integer> similarValueSentenceIds;

    @JsonProperty("value similarity")
    @JsonDeserialize(using = CustomStringToListDeserializer.class)
    private List<Double> valueSimilarities;

    @JsonProperty("final similar sentence id")
    @JsonDeserialize(using = CustomStringToListDeserializer.class)
    private List<Integer> finalSimilarSentenceIds;

    @JsonProperty("final similarity")
    @JsonDeserialize(using = CustomStringToListDeserializer.class)
    private List<Double> finalSimilarities;
}

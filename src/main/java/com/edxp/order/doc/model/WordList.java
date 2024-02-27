package com.edxp.order.doc.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WordList {
    @JsonProperty("INDEX")
    private int index;
    @JsonProperty("WORD")
    private String word;
    @JsonProperty("TOP_LEFT_X")
    private double topLeftX;
    @JsonProperty("TOP_LEFT_Y")
    private double topLeftY;
    @JsonProperty("BOTTOM_RIGHT_X")
    private double bottomRightX;
    @JsonProperty("BOTTOM_RIGHT_Y")
    private double bottomRightY;
}

package com.edxp.domain.doc;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParsedDocument {
    @JsonProperty("INDEX")
    private int index;
    @JsonProperty("LABEL")
    private String label;
    @JsonProperty("PAGE")
    private int page;
    @JsonProperty("SECTION")
    private String section;
    @JsonProperty("SENTENCE")
    private String sentence;
    @JsonProperty("WORDLIST")
    private List<WordList> wordList;
}





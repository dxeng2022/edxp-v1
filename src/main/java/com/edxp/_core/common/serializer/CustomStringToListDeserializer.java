package com.edxp._core.common.serializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class CustomStringToListDeserializer extends JsonDeserializer<List<?>> {

    @Override
    public List<?> deserialize(JsonParser p, DeserializationContext context) throws IOException {
        String text = p.getText();
        text = text.substring(1, text.length() - 1);

        if (text.contains(".")) {
            return Arrays.stream(text.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(Double::valueOf)
                    .collect(Collectors.toList());
        } else {
            return Arrays.stream(text.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(Integer::valueOf)
                    .collect(Collectors.toList());
        }
    }
}

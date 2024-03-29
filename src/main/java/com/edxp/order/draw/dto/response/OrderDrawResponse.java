package com.edxp.order.draw.dto.response;

import com.edxp.order.draw.model.PlantLine;
import com.edxp.order.draw.model.PlantModel;
import com.edxp.order.draw.model.PlantSymbol;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.*;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class OrderDrawResponse {
    private PlantModel plantModel;
    private HashMap<String, Integer> symbols;
    private HashMap<String, Integer> lines;
    private int countSymbol;
    private int countLine;

    public static OrderDrawResponse of (
            PlantModel plantModel,
            HashMap<String, Integer> symbols,
            HashMap<String, Integer> lines,
            int countSymbol,
            int countLine
    ) {
        HashMap<String, Integer> sortedSymbols = sortHashMapWithValue(symbols);
        HashMap<String, Integer> sortedLines = sortHashMapWithValue(lines);

        return new OrderDrawResponse(
                plantModel,
                sortedSymbols,
                sortedLines,
                countSymbol,
                countLine
        );
    }

    public static OrderDrawResponse from(PlantModel plantModel) {
        HashMap<String, Integer> symbols = new HashMap<>();
        HashMap<String, Integer> lines = new HashMap<>();
        int countSymbol = 0;
        int countLine = 0;

        if (plantModel != null && plantModel.getChildren() != null && plantModel.getChildren() != null) {
            List<Object> elements = plantModel.getChildren();

            for (Object element : elements) {
                if (element instanceof PlantSymbol) {
                    countSymbol++;
                    String name = ((PlantSymbol) element).getComponentClass();
                    if (name.equals("")) name = ((PlantSymbol) element).getSymbolType();
                    symbols.put(name, symbols.getOrDefault(name, 0) + 1);
                }

                if (element instanceof PlantLine) {
                    countLine++;
                    String name = ((PlantLine) element).getLineStyle();
                    lines.put(name, lines.getOrDefault(name, 0) + 1);
                }
            }
        }

        return OrderDrawResponse.of(plantModel, symbols, lines, countSymbol, countLine);
    }

    private static HashMap<String, Integer> sortHashMapWithValue(HashMap<String, Integer> hashMap) {
        List<Map.Entry<String, Integer>> entryList = new ArrayList<>(hashMap.entrySet());

        // Sort the list based on values
        entryList.sort(Map.Entry.comparingByValue(Comparator.reverseOrder()));

        // Convert the sorted list back to HashMap
        return entryList.stream()
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
    }
}

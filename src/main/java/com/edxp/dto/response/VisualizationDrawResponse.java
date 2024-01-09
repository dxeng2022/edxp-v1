package com.edxp.dto.response;

import com.edxp.domain.doc.PlantLine;
import com.edxp.domain.doc.PlantModel;
import com.edxp.domain.doc.PlantSymbol;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.HashMap;
import java.util.List;

@Getter
@AllArgsConstructor
public class VisualizationDrawResponse {
    private PlantModel plantModel;
    private HashMap<String, Integer> symbols;
    private HashMap<String, Integer> lines;
    private int countSymbol;
    private int countLine;

    public static VisualizationDrawResponse of (
            PlantModel plantModel,
            HashMap<String, Integer> symbols,
            HashMap<String, Integer> lines,
            int countSymbol,
            int countLine
    ) {
        return new VisualizationDrawResponse(
                plantModel,
                symbols,
                lines,
                countSymbol,
                countLine
        );
    }

    public static VisualizationDrawResponse from(PlantModel plantModel) {
        HashMap<String, Integer> symbols = new HashMap<>();
        HashMap<String, Integer> lines = new HashMap<>();
        int countSymbol = 0;
        int countLine = 0;

        if (plantModel != null && plantModel.getChildren() != null && plantModel.getChildren().getElements() != null) {
            List<Object> elements = plantModel.getChildren().getElements();

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

        return VisualizationDrawResponse.of(plantModel, symbols, lines, countSymbol, countLine);
    }
}

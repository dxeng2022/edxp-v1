package com.edxp.order.doccross.dto;

import com.edxp.order.doccross.model.CrossValidationDocument;
import com.edxp.order.doccross.model.CrossValidationVisualization;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDocCrossResponse {
    private List<CrossValidationDocument> document;
    private List<CrossValidationVisualization> crossValidationVisualizations;

    public static OrderDocCrossResponse of(
            List<CrossValidationDocument> document,
            List<CrossValidationVisualization> crossValidationVisualizations
    ) {
        return new OrderDocCrossResponse(document, crossValidationVisualizations);
    }
}

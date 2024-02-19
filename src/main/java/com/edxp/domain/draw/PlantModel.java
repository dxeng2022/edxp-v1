package com.edxp.domain.draw;

import lombok.Data;

import javax.xml.bind.annotation.*;
import java.util.List;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "PlantModel")
public class PlantModel {
    @XmlElement(name = "Id")
    private String id;
    @XmlElement(name = "Name")
    private String name;
    @XmlElement(name = "IsVisible")
    private boolean isVisible;
    @XmlElementWrapper(name = "Children")
    @XmlElements({
            @XmlElement(name = "PlantSymbol", type = PlantSymbol.class),
            @XmlElement(name = "PlantLine", type = PlantLine.class),
            @XmlElement(name = "Label", type = Label.class)
    })
    private List<Object> children;
    @XmlElement(name = "PaperSize")
    private PaperSize paperSize;

    @Data
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlRootElement(name = "PaperSize")
    static class PaperSize {
        @XmlElement(name = "Width")
        private int width;
        @XmlElement(name = "Height")
        private int height;
    }
}

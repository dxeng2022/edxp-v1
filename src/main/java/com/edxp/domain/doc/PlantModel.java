package com.edxp.domain.doc;

import lombok.Data;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

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
    @XmlElement(name = "Children")
    private Children children;
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

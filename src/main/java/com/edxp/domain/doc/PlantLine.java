package com.edxp.domain.doc;

import lombok.Data;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "PlantLine")
public class PlantLine {
    @XmlElement(name = "Id")
    private String id;
    @XmlElement(name = "Name")
    private String name;
    @XmlElement(name = "IsVisible")
    private boolean isVisible;
    @XmlElement(name = "Start")
    private Start start;
    @XmlElement(name = "End")
    private End end;
    @XmlElement(name = "LineType")
    private String lineType;
    @XmlElement(name = "LineStyle")
    private String lineStyle;
    @XmlElement(name = "LineClass")
    private String lineClass;

    @Data
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlRootElement(name = "Start")
    static class Start {
        @XmlElement(name = "Position")
        private Position position;
    }

    @Data
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlRootElement(name = "End")
    static class End {
        @XmlElement(name = "Position")
        private Position position;
    }

    @Data
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlRootElement(name = "Position")
    static class Position {
        @XmlElement(name = "X")
        private double x;
        @XmlElement(name = "Y")
        private double y;
    }
}

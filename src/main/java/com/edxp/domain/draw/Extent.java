package com.edxp.domain.draw;

import lombok.Data;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "Extent")
public class Extent {
    @XmlElement(name = "CoordinateSystem")
    private CoordinateSystem coordinateSystem;

    @Data
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlRootElement(name = "CoordinateSystem")
    static class CoordinateSystem {
        @XmlElement(name = "Location")
        private Location location;

        @Data
        @XmlAccessorType(XmlAccessType.FIELD)
        @XmlRootElement(name = "Location")
        static class Location {
            @XmlElement(name = "X")
            private double x;
            @XmlElement(name = "Y")
            private double y;
        }
    }
}

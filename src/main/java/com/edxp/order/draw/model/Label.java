package com.edxp.order.draw.model;

import lombok.Data;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "Label")
public class Label {
    @XmlElement(name = "Id")
    private String id;
    @XmlElement(name = "Name")
    private String name;
    @XmlElement(name = "IsVisible")
    private boolean isVisible;
    @XmlElement(name = "Extent")
    private Extent extent;
    @XmlElement(name = "Text")
    private String text;
}

package com.edxp.domain.doc;

import lombok.*;

import javax.xml.bind.annotation.*;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "PlantSymbol")
public class PlantSymbol {
    @XmlElement(name = "Id")
    private String id;
    @XmlElement(name = "Name")
    private String name;
    @XmlElement(name = "IsVisible")
    private boolean isVisible;
    @XmlElement(name = "Extent")
    private Extent extent;
    @XmlElement(name = "SymbolType")
    private String symbolType;
    @XmlElement(name = "ComponentClass")
    private String componentClass;
}

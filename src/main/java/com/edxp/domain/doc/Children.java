package com.edxp.domain.doc;

import lombok.Data;

import javax.xml.bind.annotation.*;
import java.util.List;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "Children")
public class Children {
    @XmlAnyElement(lax = true)
    @XmlElementRefs({
            @XmlElementRef(name = "PlantSymbol", type = PlantSymbol.class),
            @XmlElementRef(name = "Label", type = Label.class),
            @XmlElementRef(name = "PlantLine", type = PlantLine.class)
    })
    private List<Object> elements;
}

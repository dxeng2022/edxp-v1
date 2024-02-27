package com.edxp.order.doc.converter;

import com.edxp._core.common.annotation.Converter;
import com.edxp.order.doc.dto.request.OrderDocRequest;
import com.edxp.order.doc.entity.OrderDocEntity;

@Converter
public class OrderDocConverter {
    public OrderDocEntity toEntity(OrderDocRequest request) {
        return OrderDocEntity.of(
                    request.getOriginalFileName(),
                    request.getOriginalFileSize(),
                    request.getOrderFileName(),
                    request.getOrderFileSize()
                );
    }
}

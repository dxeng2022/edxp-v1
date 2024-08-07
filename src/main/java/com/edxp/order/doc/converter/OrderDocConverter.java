package com.edxp.order.doc.converter;

import com.edxp._core.common.annotation.Converter;
import com.edxp._core.common.utils.DateUtil;
import com.edxp._core.common.utils.FileUtil;
import com.edxp.order.doc.dto.request.OrderDocRequest;
import com.edxp.order.doc.dto.response.OrderDocCountResponse;
import com.edxp.order.doc.dto.response.OrderDocResponse;
import com.edxp.order.doc.entity.OrderDocEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Converter
public class OrderDocConverter {
    public OrderDocEntity toEntity(OrderDocRequest request) {
        return OrderDocEntity.of(
                    request.getOriginalFileName(),
                    request.getOriginalFilePath(),
                    request.getOriginalFileSize(),
                    request.getOrderFileName(),
                    request.getOrderFileSize()
                );
    }

    public OrderDocResponse toResponse(OrderDocEntity entity) {
        String originalFileVolume = FileUtil.getSizeFormat(entity.getOriginalFileSize());
        String orderFileVolume = FileUtil.getSizeFormat(entity.getOrderFileSize());
        String parsedDate = DateUtil.getDateFormat(new Date(entity.getParsedDate().getTime()));
        String extractedDate;
        if (entity.getExtractedDate() == null) extractedDate = "-";
        else extractedDate = DateUtil.getDateFormat(new Date(entity.getExtractedDate().getTime()));
        String deletedAt;
        if (entity.getDeletedAt() == null) deletedAt = "-";
        else deletedAt = DateUtil.getDateFormat(new Date(entity.getDeletedAt().getTime()));

        return OrderDocResponse.of(
                entity.getId(),
                entity.getUserId(),
                entity.getOriginalFileName(),
                entity.getOriginalFilePath(),
                entity.getOriginalFileSize(),
                originalFileVolume,
                entity.getOrderFileName(),
                entity.getOrderFileSize(),
                orderFileVolume,
                parsedDate,
                extractedDate,
                deletedAt
        );
    }

    public Page<OrderDocResponse> entityToResponseWitPage(Page<OrderDocEntity> entities) {
        List<OrderDocResponse> responseList = entities.getContent()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(responseList, entities.getPageable(), entities.getTotalElements());
    }

    public OrderDocCountResponse toParsingResponse(int userCount, long count) {

        return OrderDocCountResponse.builder()
                .userParsingCount(userCount)
                .parsingCount(count)
                .build();
    }

    public OrderDocCountResponse toExtractResponse(int userCount, long count) {

        return OrderDocCountResponse.builder()
                .userExtractCount(userCount)
                .extractCount(count)
                .build();
    }
}

package com.edxp.order.doc.service;

import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.order.doc.entity.OrderDocEntity;
import com.edxp.order.doc.repository.OrderDocRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;

@RequiredArgsConstructor
@Service
public class OrderDocService {
    private final OrderDocRepository orderDocRepository;

    @Transactional
    public OrderDocEntity order(Long userId, OrderDocEntity entity) {
        entity.setUserId(userId);

        return orderDocRepository.save(entity);
    }

    @Transactional
    public void riskExtract(Long userId, String orderFileName) {
        final OrderDocEntity entity = orderDocRepository.findFirstByUserIdAndOrderFileNameOrderByIdDesc(userId, orderFileName)
                .orElseThrow(() -> new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "order is not founded"));

        if (entity.getExtractedDate() != null) throw new EdxpApplicationException(ErrorCode.ALREADY_EXTRACTED);
        entity.setExtractedDate(Timestamp.from(Instant.now()));

        orderDocRepository.save(entity);
    }
}

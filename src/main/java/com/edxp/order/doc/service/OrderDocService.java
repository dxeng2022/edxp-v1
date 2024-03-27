package com.edxp.order.doc.service;

import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.order.doc.entity.OrderDocEntity;
import com.edxp.order.doc.repository.OrderDocRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;

@RequiredArgsConstructor
@Service
public class OrderDocService {
    private final OrderDocRepository orderDocRepository;

    // 주문 내용 조회
    @Transactional(readOnly = true)
    public Page<OrderDocEntity> getOrderList(Long userId, Pageable pageable) {
        return orderDocRepository.findAllByUserId(userId, pageable);
    }

    // 주문 저장
    @Transactional
    public OrderDocEntity order(Long userId, OrderDocEntity entity) {
        entity.setUserId(userId);

        return orderDocRepository.save(entity);
    }

    //
    @Transactional
    public void riskExtract(Long userId, String orderFileName) {
        final OrderDocEntity entity = orderDocRepository.findFirstByUserIdAndOrderFileNameOrderByIdDesc(userId, orderFileName)
                .orElseThrow(() -> new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "order is not founded"));

        if (entity.getExtractedDate() != null) throw new EdxpApplicationException(ErrorCode.ALREADY_EXTRACTED);
        entity.setExtractedDate(Timestamp.from(Instant.now()));

        orderDocRepository.save(entity);
    }
}

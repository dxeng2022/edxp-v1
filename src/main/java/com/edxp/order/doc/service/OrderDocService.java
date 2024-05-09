package com.edxp.order.doc.service;

import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.order.doc.converter.OrderDocConverter;
import com.edxp.order.doc.dto.request.OrderDocRequest;
import com.edxp.order.doc.entity.OrderDocEntity;
import com.edxp.order.doc.repository.OrderDocRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@RequiredArgsConstructor
@Service
public class OrderDocService {
    private final OrderDocRepository orderDocRepository;
    private final OrderDocConverter orderDocConverter;

    // 주문 내용 조회
    @Transactional(readOnly = true)
    public Page<OrderDocEntity> getOrderListWithPage(Long userId, Pageable pageable) {
        return orderDocRepository.findAllByUserId(userId, pageable);
    }

    // 주문 전체 내용 조회
    @Transactional(readOnly = true)
    public List<OrderDocEntity> getOrderList(Long userId) {
        return orderDocRepository.findByUserIdAndExtractedDateIsNotNull(userId);
    }

    // 주문 저장
    @Transactional
    public OrderDocEntity order(Long userId, OrderDocRequest request) {
        final OrderDocEntity entity = orderDocConverter.toEntity(request);
        entity.setUserId(userId);

        return orderDocRepository.save(entity);
    }

    // 분석 실행
    @Transactional
    public void riskExtract(Long userId, String orderFileName) {
        final OrderDocEntity entity = orderDocRepository.findFirstByUserIdAndOrderFileNameOrderByIdDesc(userId, orderFileName)
                .orElseThrow(() -> new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "order is not founded"));

        if (entity.getExtractedDate() != null) throw new EdxpApplicationException(ErrorCode.ALREADY_EXTRACTED);
        entity.setExtractedDate(Timestamp.from(Instant.now()));

        orderDocRepository.save(entity);
    }

    // 분석 파일 삭제
    @Transactional
    public void deleteRiskExtract(Long userId, String orderFileName) {
        final OrderDocEntity entity = orderDocRepository.findFirstByUserIdAndOrderFileNameOrderByIdDesc(userId, orderFileName)
                .orElseThrow(() -> new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "order is not founded"));

        if (entity.getDeletedAt() != null) throw new EdxpApplicationException(ErrorCode.ALREADY_DELETED);
        entity.setDeletedAt(Timestamp.from(Instant.now()));

        orderDocRepository.save(entity);
    }
}

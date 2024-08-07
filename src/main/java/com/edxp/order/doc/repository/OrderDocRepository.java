package com.edxp.order.doc.repository;

import com.edxp.order.doc.entity.OrderDocEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

public interface OrderDocRepository extends JpaRepository<OrderDocEntity, Long> {
    Optional<OrderDocEntity> findFirstByUserIdAndOrderFileNameOrderByIdDesc(Long userId, String OrderFileName);
    Page<OrderDocEntity> findAllByUserId(Long userId, Pageable pageable);
    List<OrderDocEntity> findByUserIdAndExtractedDateIsNotNull(Long userId);
    long countByUserIdAndParsedDateBetween(Long userId, Timestamp startDate, Timestamp endDate);
    long countByUserIdAndExtractedDateBetween(Long userId, Timestamp startDate, Timestamp endDate);
}

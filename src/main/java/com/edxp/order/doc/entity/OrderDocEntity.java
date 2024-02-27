package com.edxp.order.doc.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Objects;

@Getter
@Table(name = "\"OrderDoc\"")
@Where(clause = "deletedAt is NULL")
@Entity
public class OrderDocEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter @Column(nullable = false) private Long userId;
    @Setter @Column(nullable = false) private String originalFileName;
    @Setter @Column(nullable = false) private Long originalFileSize;
    @Setter @Column(nullable = false) private String orderFileName;
    @Setter @Column(nullable = false) private Long orderFileSize;
    @Column(nullable = false) private Timestamp parsedDate;
    @Setter private Timestamp extractedDate;
    private Timestamp deletedAt;

    protected OrderDocEntity() {}

    protected OrderDocEntity(
            String originalFileName,
            Long originalFileSize,
            String orderFileName,
            Long orderFileSize
    ) {
        this.originalFileName = originalFileName;
        this.originalFileSize = originalFileSize;
        this.orderFileName = orderFileName;
        this.orderFileSize = orderFileSize;
    }

    protected OrderDocEntity(
            Long userId,
            String originalFileName,
            Long originalFileSize,
            String orderFileName,
            Long orderFileSize,
            Timestamp parsedDate,
            Timestamp extractedDate,
            Timestamp deletedAt
    ) {
        this.userId = userId;
        this.originalFileName = originalFileName;
        this.originalFileSize = originalFileSize;
        this.orderFileName = orderFileName;
        this.orderFileSize = orderFileSize;
        this.parsedDate = parsedDate;
        this.extractedDate = extractedDate;
        this.deletedAt = deletedAt;
    }

    @PrePersist
    void parsedDate() {
        this.parsedDate = Timestamp.from(Instant.now());
    }

    public static OrderDocEntity of (
            String originalFileName,
            Long originalFileSize,
            String orderFileName,
            Long orderFileSize
    ) {
        return new OrderDocEntity(
                originalFileName,
                originalFileSize,
                orderFileName,
                orderFileSize
        );
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrderDocEntity)) return false;
        OrderDocEntity that = (OrderDocEntity) o;
        return this.getId() != null && this.getId().equals(that.getId());
    }

    @Override
    public int hashCode() { return Objects.hash(this.getId()); }
}

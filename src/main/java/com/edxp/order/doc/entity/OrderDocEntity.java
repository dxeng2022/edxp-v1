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
    @Setter @Column(nullable = false) private String originalFilePath;
    @Setter @Column(nullable = false) private Long originalFileSize;
    @Setter @Column(nullable = false) private String orderFileName;
    @Setter @Column(nullable = false) private Long orderFileSize;
    @Column(nullable = false) private Timestamp parsedDate;
    @Setter private Timestamp extractedDate;
    @Setter private Timestamp deletedAt;

    protected OrderDocEntity() {}

    protected OrderDocEntity(
            String originalFileName,
            String originalFilePath,
            Long originalFileSize,
            String orderFileName,
            Long orderFileSize
    ) {
        this.originalFileName = originalFileName;
        this.originalFilePath = originalFilePath;
        this.originalFileSize = originalFileSize;
        this.orderFileName = orderFileName;
        this.orderFileSize = orderFileSize;
    }

    @PrePersist
    void parsedDate() {
        this.parsedDate = Timestamp.from(Instant.now());
    }

    public static OrderDocEntity of (
            String originalFileName,
            String originalFilePath,
            Long originalFileSize,
            String orderFileName,
            Long orderFileSize
    ) {
        return new OrderDocEntity(
                originalFileName,
                originalFilePath,
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

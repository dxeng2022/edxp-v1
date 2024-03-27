package com.edxp.s3file.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.Instant;

@Getter
@Table(name = "\"FileDetail\"")
@Entity
public class FileDetailEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter @Column(nullable = false) private Long userId;
    @Setter @Column(nullable = false) private String fileName;
    @Setter @Column(nullable = false) private String fileOriginalName;
    @Setter @Column(nullable = false) private Long fileSize;
    @Setter @Column(nullable = false) private String filePath;
    private Timestamp registeredAt;

    protected FileDetailEntity() {}

    public FileDetailEntity(
            Long userId,
            String fileName,
            String fileOriginalName,
            Long fileSize,
            String filePath
    ) {
        this.userId = userId;
        this.fileName = fileName;
        this.fileOriginalName = fileOriginalName;
        this.fileSize = fileSize;
        this.filePath = filePath;
    }

    @PrePersist
    void registeredAt() {
        this.registeredAt = Timestamp.from(Instant.now());
    }

    public static FileDetailEntity of(
            Long userId,
            String fileName,
            String fileOriginalName,
            Long fileSize,
            String filePath
    ) {
        return new FileDetailEntity(userId, fileName, fileOriginalName, fileSize, filePath);
    }
}

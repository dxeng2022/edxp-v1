package com.edxp.dto;

import com.edxp.domain.FileDetailEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FileDetail {
    private Long id;
    private Long userId;
    private String fileName;
    private String fileOriginalName;
    private Long fileSize;
    private String filePath;
    private Timestamp registeredAt;

    public static FileDetail of(Long userId, String fileName, String fileOriginalName, Long fileSize, String filePath) {
        return new FileDetail(null, userId, fileName, fileOriginalName, fileSize, filePath, null);
    }

    public static FileDetail fromEntity(FileDetailEntity entity) {
        return new FileDetail(
                entity.getId(),
                entity.getUserId(),
                entity.getFileName(),
                entity.getFileOriginalName(),
                entity.getFileSize(),
                entity.getFilePath(),
                entity.getRegisteredAt()
        );
    }
}

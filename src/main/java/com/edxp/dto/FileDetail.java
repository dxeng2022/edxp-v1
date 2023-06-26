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
    private Long userId;
    private String fileName;
    private String fileOriginalName;
    private Long fileSize;
    private String filePath;
    private Timestamp registeredAt;

    public static FileDetail fromEntity(FileDetailEntity entity) {
        return new FileDetail(
                entity.getId(),
                entity.getFileName(),
                entity.getFileOriginalName(),
                entity.getFileSize(),
                entity.getFilePath(),
                entity.getRegisteredAt()
        );
    }
}

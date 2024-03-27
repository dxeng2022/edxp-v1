package com.edxp.s3file.repository;

import com.edxp.s3file.entity.FileDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<FileDetailEntity, Long> {
}

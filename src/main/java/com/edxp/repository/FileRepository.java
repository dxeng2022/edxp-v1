package com.edxp.repository;

import com.edxp.domain.FileDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<FileDetailEntity, Long> {
}

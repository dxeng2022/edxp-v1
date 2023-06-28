package com.edxp.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@AllArgsConstructor
public class FileUploadRequest {
    private String currentPath;
    private MultipartFile file;
}

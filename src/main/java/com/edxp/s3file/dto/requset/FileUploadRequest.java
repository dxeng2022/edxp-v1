package com.edxp.s3file.dto.requset;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class FileUploadRequest {
    private String currentPath;
    private List<MultipartFile> files;

    public static FileUploadRequest of(String currentPath, List<MultipartFile> files) {
        return new FileUploadRequest(currentPath, files);
    }
}

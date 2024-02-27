package com.edxp.s3file.dto.requset;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FileUpdateRequest {
    private String currentPath;
    private String currentName;
    private String updateName;
    private String extension;
}

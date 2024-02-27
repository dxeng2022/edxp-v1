package com.edxp.s3file.dto.requset;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FileFolderAddRequest {
    private String currentPath;
    private String folderName;
}

package com.edxp.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FolderAddRequest {
    private String currentPath;
    private String folderName;
}

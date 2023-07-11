package com.edxp.dto.request;

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

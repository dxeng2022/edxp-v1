package com.edxp.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class FileDeleteRequest {
    private String currentPath;
    private List<String> filePaths;
}

package com.edxp.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class FileDeleteRequest {
    private List<String> filePaths;
}

package com.edxp.s3file.dto.requset;

import lombok.Data;

import java.util.List;

@Data
public class FileDownloadsRequest {
    private String currentPath;
    private List<String> filePaths;
}

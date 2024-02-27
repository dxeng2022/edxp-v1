package com.edxp.s3file.dto.requset;

import lombok.Data;

import java.util.List;

@Data
public class FileDeleteRequest {
    private List<String> filePaths;
}

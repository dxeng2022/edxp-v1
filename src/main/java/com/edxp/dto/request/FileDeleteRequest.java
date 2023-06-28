package com.edxp.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class FileDeleteRequest {
    private String filePath;
}

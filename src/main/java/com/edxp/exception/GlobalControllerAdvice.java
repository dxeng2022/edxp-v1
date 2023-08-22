package com.edxp.exception;

import com.edxp.common.response.CommonResponse;
import com.edxp.constant.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.Arrays;

@Slf4j
@RestControllerAdvice
public class GlobalControllerAdvice {
    @ExceptionHandler(EdxpApplicationException.class)
    public ResponseEntity<?> applicationHandler(EdxpApplicationException e) {
        log.error("Error occurs {}", e.toString());
        return ResponseEntity.status(e.getErrorCode().getStatus())
                .body(CommonResponse.error(e.getErrorCode().name()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> applicationHandler(RuntimeException e) {
        log.error("Error occurs : {}", e.toString());
        log.error("Caused by : {}", Arrays.toString(e.getStackTrace()));
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(CommonResponse.error(ErrorCode.INTERNAL_SERVER_ERROR.name()));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<?> applicationHandler(MaxUploadSizeExceededException e) {
        log.error("Error occurs {}", e.toString());
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(CommonResponse.error(ErrorCode.MAX_FILE_UPLOADED.name()));
    }
}

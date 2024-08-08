package com.edxp._core.handler.exception;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.constant.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.io.PrintWriter;
import java.io.StringWriter;

@Slf4j
@RestControllerAdvice
public class GlobalControllerAdvice {
    @ExceptionHandler(EdxpApplicationException.class)
    public ResponseEntity<?> applicationHandler(EdxpApplicationException e) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        String stackTrace = sw.toString();

        log.debug("Occurs at {}:{}", e.getStackTrace()[0].getClassName(), e.getStackTrace()[0].getLineNumber());
        log.debug("Stack Trace >>> {}", stackTrace);

        return ResponseEntity.status(e.getErrorCode().getStatus())
                .body(CommonResponse.error(e.getErrorCode().name(), e.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> applicationHandler(RuntimeException e) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        String stackTrace = sw.toString();

        String message = !ObjectUtils.isEmpty(e.getMessage()) ? e.getMessage() : "";

        log.debug("Occurs at {}:{}", e.getStackTrace()[0].getClassName(), e.getStackTrace()[0].getLineNumber());
        log.debug("Stack Trace >>> {}", stackTrace);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(CommonResponse.error(ErrorCode.INTERNAL_SERVER_ERROR.name(), message));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<?> applicationHandler(MaxUploadSizeExceededException e) {

        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(CommonResponse.error(ErrorCode.MAX_FILE_UPLOADED.name(), null));
    }
}

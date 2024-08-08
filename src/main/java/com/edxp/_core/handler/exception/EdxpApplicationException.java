package com.edxp._core.handler.exception;

import com.edxp._core.constant.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EdxpApplicationException extends RuntimeException {
    private final ErrorCode errorCode;
    private final String message;

    public EdxpApplicationException(ErrorCode errorCode) {
        this.errorCode = errorCode;
        this.message = null;
    }

    @Override
    public String getMessage() {
        if (message == null) {
            return errorCode.getMessage();
        }

        return String.format("%s. %s.", errorCode.getMessage(), message);
    }
}

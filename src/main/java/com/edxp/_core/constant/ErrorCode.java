package com.edxp._core.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not founded"),
    DUPLICATED_USER_NAME(HttpStatus.CONFLICT, "Username is duplicated"),
    INVALID_AUTH_CODE(HttpStatus.BAD_REQUEST, "Auth code is invalid"),
    USER_NOT_LOGIN(HttpStatus.UNAUTHORIZED, "User not login"),
    FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "File is not founded"),
    FILE_NOT_ATTACHED(HttpStatus.INTERNAL_SERVER_ERROR, "File is not attached"),
    DUPLICATED_FILE_NAME(HttpStatus.CONFLICT, "Filename is duplicated"),
    MAX_FILE_UPLOADED(HttpStatus.INTERNAL_SERVER_ERROR, "File is max uploaded"),


    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error")
    ;

    private final HttpStatus status;
    private final String message;
}

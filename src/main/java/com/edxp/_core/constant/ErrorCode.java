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
    USER_NOT_LOGIN(HttpStatus.UNAUTHORIZED, "User is not login"),
    INVALID_PATH(HttpStatus.BAD_REQUEST, "Path is invalid"),
    FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "File is not founded"),
    FILE_NOT_ATTACHED(HttpStatus.INTERNAL_SERVER_ERROR, "File is not attached"),
    DUPLICATED_FILE_NAME(HttpStatus.CONFLICT, "Filename is duplicated"),
    MAX_FILE_UPLOADED(HttpStatus.INTERNAL_SERVER_ERROR, "Files are max uploaded"),
    OVER_VOLUME_UPLOADED(HttpStatus.INTERNAL_SERVER_ERROR, "File is over storage volume"),
    OVER_PARSING_COUNT(HttpStatus.BAD_REQUEST, "Parsing count is over"),
    OVER_EXTRACT_COUNT(HttpStatus.BAD_REQUEST, "Extract count is over"),
    ALREADY_EXTRACTED(HttpStatus.BAD_REQUEST, "Already extracted"),
    ALREADY_DELETED(HttpStatus.BAD_REQUEST, "Already deleted"),

    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error")
    ;

    private final HttpStatus status;
    private final String message;
}

package com.edxp._core.common.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommonResponse<T> {
    private String resultCode;
    private String message;
    private T result;

    public static CommonResponse<Void> success() {
        return new CommonResponse<>("SUCCESS", "OK", null);
    }

    public static <T> CommonResponse<T> success(T result) {
        return new CommonResponse<>("SUCCESS", "OK", result);
    }

    public static CommonResponse<Void> error(String errorCode, String errorMessage) {
        return new CommonResponse<>(errorCode, errorMessage, null);
    }
}

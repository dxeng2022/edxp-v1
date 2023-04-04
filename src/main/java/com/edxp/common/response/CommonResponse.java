package com.edxp.common.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommonResponse<T> {
    private String resultCode;
    private T result;

    public static CommonResponse<Void> success() {
        return new CommonResponse<>("SUCCESS", null);
    }

    public static <T> CommonResponse<T> success(T result) {
        return new CommonResponse<>("SUCCESS", result);
    }

    public static CommonResponse<Void> error(String errorCode) {
        return new CommonResponse<>(errorCode, null);
    }
}

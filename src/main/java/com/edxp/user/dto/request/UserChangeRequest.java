package com.edxp.user.dto.request;

import lombok.Data;

@Data
public class UserChangeRequest {
    private String prePassword;
    private String newPassword;
    private String phone;
}

package com.edxp.user.dto.request;

import lombok.Data;

@Data
public class UserSignUpRequest {
    private String username;
    private String password;
    private String name;
    private String phone;
    private String gender;
    private String birth;
    private String organization;
    private String job;
}

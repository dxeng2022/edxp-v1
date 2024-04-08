package com.edxp.user.dto.request;

import lombok.Data;

@Data
public class UserFindRequest {
    private String username;
    private String name;
    private String phone;
    private String birth;
}

package com.edxp.user.dto.response;

import com.edxp._core.constant.RoleType;
import lombok.Builder;
import lombok.Getter;

import java.sql.Timestamp;
import java.util.List;

@Builder
@Getter
public class UserInfoResponse {
    private Long id;
    private String username;
    private String name;
    private String phone;
    private String gender;
    private String birth;
    private String organization;
    private String job;
    private List<RoleType> roles;
    private Timestamp registeredAt;
    private Timestamp updatedAt;
    private Timestamp deletedAt;
}

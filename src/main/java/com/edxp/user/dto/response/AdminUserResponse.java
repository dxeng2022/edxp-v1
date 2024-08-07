package com.edxp.user.dto.response;

import com.edxp._core.constant.RoleType;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.sql.Timestamp;
import java.util.List;

@Slf4j
@Builder
@Getter
public class AdminUserResponse {
    private Long id;
    private String username;
    private String name;
    private String organization;
    private String job;
    private List<RoleType> roles;
    private String registeredAtFormed;
    private String updatedAtFormed;
    private String deletedAtFormed;
    private Timestamp registeredAt;
    private Timestamp updatedAt;
    private Timestamp deletedAt;
}

package com.edxp.dto.response;

import com.edxp.dto.User;
import lombok.Builder;
import lombok.Getter;

import java.sql.Timestamp;

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
    private String role;
    private Timestamp registeredAt;
    private Timestamp updatedAt;
    private Timestamp deletedAt;

    public static UserInfoResponse from(User user) {
        return UserInfoResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .phone(user.getPhone())
                .gender(user.getGender())
                .birth(user.getBirth())
                .organization(user.getOrganization())
                .job(user.getJob())
                .role(user.getRole())
                .registeredAt(user.getRegisteredAt())
                .updatedAt(user.getUpdatedAt())
                .deletedAt(user.getDeletedAt())
                .build();
    }
}

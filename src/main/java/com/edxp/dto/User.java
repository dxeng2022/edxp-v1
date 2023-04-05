package com.edxp.dto;

import com.edxp.domain.UserEntity;
import com.edxp.dto.request.UserCheckRequest;
import com.edxp.dto.request.UserSignUpRequest;
import lombok.*;

import java.sql.Timestamp;

@Builder
@Getter
public class User {
    private Long id;
    private String username;
    private String password;
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

    public static User fromEntity(UserEntity entity) {
        return new User(
                entity.getId(),
                entity.getUsername(),
                entity.getPassword(),
                entity.getName(),
                entity.getPhone(),
                entity.getGender(),
                entity.getBirth(),
                entity.getOrganization(),
                entity.getJob(),
                entity.getRole(),
                entity.getRegisteredAt(),
                entity.getUpdatedAt(),
                entity.getDeletedAt()
        );
    }
}

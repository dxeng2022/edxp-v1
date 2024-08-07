package com.edxp.user.dto;

import com.edxp._core.constant.RoleType;
import com.edxp.user.entity.UserEntity;
import lombok.*;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

@Builder
@Getter
public class User implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String username;
    private String password;
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

    public boolean isUserCharged() {

        return this.roles.contains(RoleType.USER_DRAW) ||
                this.roles.contains(RoleType.USER_SHEET) ||
                this.roles.contains(RoleType.USER_DOC);
    }

    public static User of(
            Long id,
            String username,
            String password,
            String name,
            String phone,
            String gender,
            String birth,
            String organization,
            String job,
            List<RoleType> roles,
            Timestamp registeredAt,
            Timestamp updatedAt,
            Timestamp deletedAt
    ) {
        return new User(
                id,
                username,
                password,
                name,
                phone,
                gender,
                birth,
                organization,
                job,
                roles,
                registeredAt,
                updatedAt,
                deletedAt
        );
    }

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
                entity.getRoles(),
                entity.getRegisteredAt(),
                entity.getUpdatedAt(),
                entity.getDeletedAt()
        );
    }
}

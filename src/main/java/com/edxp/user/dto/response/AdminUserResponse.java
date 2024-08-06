package com.edxp.user.dto.response;

import com.edxp._core.constant.RoleType;
import com.edxp.user.dto.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Slf4j
@Getter
@NoArgsConstructor
@AllArgsConstructor
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

    public static AdminUserResponse of (
            Long id,
            String username,
            String name,
            String organization,
            String job,
            List<RoleType> roles,
            String registeredAtFormed,
            String updatedAtFormed,
            String deletedAtFormed,
            Timestamp registeredAt,
            Timestamp updatedAt,
            Timestamp deletedAt
    ) {
        return new AdminUserResponse(
                id,
                username,
                name,
                organization,
                job,
                roles,
                registeredAtFormed,
                updatedAtFormed,
                deletedAtFormed,
                registeredAt,
                updatedAt,
                deletedAt
        );
    }

    public static AdminUserResponse from(User user) {

        return AdminUserResponse.of(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getOrganization(),
                user.getJob(),
                user.getRoles(),
                formatDate(user.getRegisteredAt()),
                formatDate(user.getUpdatedAt()),
                formatDate(user.getDeletedAt()),
                user.getRegisteredAt(),
                user.getUpdatedAt(),
                user.getDeletedAt()
        );
    }

    private static String formatDate(Timestamp timestamp) {
        if (timestamp == null) return "";

        String result = null;
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
            result = formatter.format(new Date(timestamp.getTime()));
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }
}

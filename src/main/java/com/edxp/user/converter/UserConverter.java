package com.edxp.user.converter;

import com.edxp._core.common.annotation.Converter;
import com.edxp.user.dto.User;
import com.edxp.user.dto.request.UserSignUpRequest;
import com.edxp.user.dto.response.AdminUserResponse;
import com.edxp.user.dto.response.UserInfoResponse;
import com.edxp.user.entity.UserEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static com.edxp._core.common.utils.DateUtil.formatDate;

@Converter
public class UserConverter {

    public UserEntity toEntity(UserSignUpRequest request, BCryptPasswordEncoder encoder) {

        return UserEntity.of(
                request.getUsername(),
                encoder.encode(request.getPassword()),
                request.getName(),
                request.getPhone(),
                request.getGender(),
                request.getBirth(),
                request.getOrganization(),
                request.getJob()
        );
    }

    public UserInfoResponse toResponse(User user) {

        return UserInfoResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .phone(user.getPhone())
                .gender(user.getGender())
                .birth(user.getBirth())
                .organization(user.getOrganization())
                .job(user.getJob())
                .roles(user.getRoles())
                .registeredAt(user.getRegisteredAt())
                .updatedAt(user.getUpdatedAt())
                .deletedAt(user.getDeletedAt())
                .build();
    }

    public static AdminUserResponse toAdminResponse(User user) {

        return AdminUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .organization(user.getOrganization())
                .job(user.getJob())
                .roles(user.getRoles())
                .registeredAtFormed(formatDate(user.getRegisteredAt()))
                .updatedAtFormed(formatDate(user.getUpdatedAt()))
                .deletedAtFormed(formatDate(user.getDeletedAt()))
                .registeredAt(user.getRegisteredAt())
                .updatedAt(user.getUpdatedAt())
                .deletedAt(user.getDeletedAt())
                .build();
    }
}

package com.edxp._core.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
public enum RoleType {
    USER("ROLE_USER", "유저"),
    ADMIN("ROLE_ADMIN", "관리자");

    @Getter private final String roleName;
    @Getter private final String description;
}

package com.edxp.constant;

import lombok.Getter;

public enum RoleType {
    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN");

    @Getter
    private final String description;

    RoleType(String description) {
        this.description = description;
    }
}

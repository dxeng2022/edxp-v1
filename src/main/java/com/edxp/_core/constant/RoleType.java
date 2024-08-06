package com.edxp._core.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;


@RequiredArgsConstructor
public enum RoleType  implements GrantedAuthority {
    USER("ROLE_USER", "기본 유저"),
    USER_DRAW("ROLE_USER_DRAW", "도면 결제 유저"),
    USER_SHEET("ROLE_USER_SHEET", "시트 결제 유저"),
    USER_DOC("ROLE_USER_DOC", "문서 유저"),
    ADMIN("ROLE_ADMIN", "관리자");

    @Getter private final String roleName;
    @Getter private final String description;

    @Override
    public String getAuthority() {
        return roleName;
    }
}

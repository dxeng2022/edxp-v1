package com.edxp.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserFindResponse {
    private String username;

    public static UserFindResponse of(String username) {
        return new UserFindResponse(username);
    }
}

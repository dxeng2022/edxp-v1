package com.edxp.user.business;

import com.edxp._core.common.annotation.Business;
import com.edxp._core.constant.RoleType;
import com.edxp.user.dto.User;
import com.edxp.user.dto.response.UserInfoResponse;
import com.edxp.user.service.UserService;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
@Business
public class UserAdminBusiness {
    private final UserService userService;

    /**
     * [ 유저 관리자 권한 추가 ]
     *
     * @param userId user id
     * @return 수정된 유저정보
     * @since 24.08.06
     */
    public UserInfoResponse addAdminRoleToUser(Long userId) {
        final User user = userService.addRolesToUser(userId, List.of(RoleType.ADMIN));

        return UserInfoResponse.from(user);
    }

    /**
     * [ 유저 전 모듈 권한 추가 ]
     *
     * @param userId user id
     * @return 수정된 유저정보
     * @since 24.08.06
     */
    public UserInfoResponse addAllModuleRoleToUser(Long userId) {
        final User user = userService.addRolesToUser(userId, List.of(RoleType.USER_DRAW, RoleType.USER_SHEET, RoleType.USER_DOC));

        return UserInfoResponse.from(user);
    }

    /**
     * [ 유저 관리자 권한 삭제 ]
     *
     * @param userId user id
     * @return 수정된 유저정보
     * @since 24.08.06
     */
    public UserInfoResponse removeAdminRoleFromUser(Long userId) {
        final User user = userService.removeRolesFromUser(userId, List.of(RoleType.ADMIN));

        return UserInfoResponse.from(user);
    }

    /**
     * [ 유저 전 모듈 권한 삭제 ]
     *
     * @param userId user id
     * @return 수정된 유저정보
     * @since 24.08.06
     */
    public UserInfoResponse removeAllModuleRoleFromUser(Long userId) {
        final User user = userService.removeRolesFromUser(userId, List.of(RoleType.USER_DRAW, RoleType.USER_SHEET, RoleType.USER_DOC));

        return UserInfoResponse.from(user);
    }
}

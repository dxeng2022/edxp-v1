package com.edxp.user.business;

import com.edxp._core.common.annotation.Business;
import com.edxp._core.constant.RoleType;
import com.edxp.user.converter.UserConverter;
import com.edxp.user.dto.User;
import com.edxp.user.dto.response.AdminUserResponse;
import com.edxp.user.service.UserService;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Business
public class UserAdminBusiness {
    private final UserService userService;

    /**
     * [ 전체 사용자 조회 ]
     *
     * @return 전체 사용자 리스트
     * @since 24.08.07
     */
    public List<AdminUserResponse> getUsers() {

        return userService.users().stream().map(UserConverter::toAdminResponse)
                .collect(Collectors.toList());
    }

    /**
     * [ 사용자 비밀번호 초기화 ]
     *
     * @param userId 사용자 id
     * @since 24.08.07
     */
    public void resetUserPw(Long userId) {
        userService.resetUserPw(userId);
    }

    /**
     * [ 유저 관리자 권한 추가 ]
     *
     * @param userId user id
     * @return 수정된 유저정보
     * @since 24.08.06
     */
    public AdminUserResponse addAdminRoleToUser(Long userId) {
        final User user = userService.addRolesToUser(userId, List.of(RoleType.ADMIN));

        return UserConverter.toAdminResponse(user);
    }

    /**
     * [ 유저 전 모듈 권한 추가 ]
     *
     * @param userId user id
     * @return 수정된 유저정보
     * @since 24.08.06
     */
    public AdminUserResponse addAllModuleRoleToUser(Long userId) {
        final User user = userService.addRolesToUser(userId, List.of(RoleType.USER_DRAW, RoleType.USER_SHEET, RoleType.USER_DOC));

        return UserConverter.toAdminResponse(user);
    }

    /**
     * [ 유저 관리자 권한 삭제 ]
     *
     * @param userId user id
     * @return 수정된 유저정보
     * @since 24.08.06
     */
    public AdminUserResponse removeAdminRoleFromUser(Long userId) {
        final User user = userService.removeRolesFromUser(userId, List.of(RoleType.ADMIN));

        return UserConverter.toAdminResponse(user);
    }

    /**
     * [ 유저 전 모듈 권한 삭제 ]
     *
     * @param userId user id
     * @return 수정된 유저정보
     * @since 24.08.06
     */
    public AdminUserResponse removeAllModuleRoleFromUser(Long userId) {
        final User user = userService.removeRolesFromUser(userId, List.of(RoleType.USER_DRAW, RoleType.USER_SHEET, RoleType.USER_DOC));

        return UserConverter.toAdminResponse(user);
    }

    /**
     * [ 유저 탈퇴 처리 ]
     *
     * @param userId 유저 id
     * @since 24.08.07
     */
    public void signOutUser(Long userId) {
        userService.deleteUser(userId);
    }
}

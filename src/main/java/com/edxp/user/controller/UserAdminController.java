package com.edxp.user.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp.user.business.UserAdminBusiness;
import com.edxp.user.dto.response.AdminUserResponse;
import com.edxp.user.dto.response.UserInfoResponse;
import com.edxp.user.service.AdminUserService;
import com.edxp.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/v1/user")
@RestController
public class UserAdminController {
    private final UserAdminBusiness userAdminBusiness;

    private final UserService userService;
    private final AdminUserService adminUserService;

    @CrossOrigin
    @GetMapping
    public CommonResponse<List<AdminUserResponse>> getUsers() {
        List<AdminUserResponse> users = adminUserService.users().stream()
                .map(AdminUserResponse::from).collect(Collectors.toList());
        return CommonResponse.success(users);
    }

    @CrossOrigin
    @PutMapping("/{userId}")
    public CommonResponse<Void> resetUser(@PathVariable Long userId) {
        adminUserService.resetUserPw(userId);
        return CommonResponse.success();
    }

    // 유저 관리자 권한 추가
    @CrossOrigin
    @PutMapping("/{userId}/role-admin")
    public CommonResponse<UserInfoResponse> addAdminRole(@PathVariable Long userId) {
        final UserInfoResponse response = userAdminBusiness.addAdminRoleToUser(userId);

        return CommonResponse.success(response);
    }

    // 유저 전 모듈 권한 추가
    @CrossOrigin
    @PutMapping("/{userId}/role-all")
    public CommonResponse<UserInfoResponse> addAllModuleRole(@PathVariable Long userId) {
        final UserInfoResponse response = userAdminBusiness.addAllModuleRoleToUser(userId);

        return CommonResponse.success(response);
    }

    // 유저 관리자 권한 삭제
    @CrossOrigin
    @DeleteMapping("/{userId}/role-admin")
    public CommonResponse<UserInfoResponse> deleteAdminRole(@PathVariable Long userId) {
        final UserInfoResponse response = userAdminBusiness.removeAdminRoleFromUser(userId);

        return CommonResponse.success(response);
    }

    // 유저 전 모듈 권한 삭제
    @CrossOrigin
    @DeleteMapping("/{userId}/role-all")
    public CommonResponse<UserInfoResponse> deleteAllModuleRole(@PathVariable Long userId) {
        final UserInfoResponse response = userAdminBusiness.removeAllModuleRoleFromUser(userId);

        return CommonResponse.success(response);
    }

    @CrossOrigin
    @DeleteMapping("/{userId}")
    public CommonResponse<Void> signOutUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return CommonResponse.success();
    }
}

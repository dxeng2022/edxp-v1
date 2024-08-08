package com.edxp.user.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp.user.business.UserAdminBusiness;
import com.edxp.user.dto.response.AdminUserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "1-2. [관리자 - 사용자 관리]", description = "관리자가 사용자 정보를 관리하는 기능입니다.")
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/v1/user")
@RestController
public class UserAdminController {
    private final UserAdminBusiness userAdminBusiness;

    @Operation(summary = "전체 유저 조회", description = "회원가입한 전체 유저를 조회합니다. (본인은 리스트에서 제외됩니다.)")
    @CrossOrigin
    @GetMapping
    public CommonResponse<List<AdminUserResponse>> getUsers(
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal
    ) {
        final List<AdminUserResponse> response = userAdminBusiness.getUsers(principal.getUser());

        return CommonResponse.success(response);
    }

    @Operation(summary = "유저 비밀번호 초기화", description = "해당 유저의 비밀번호를 초기화 합니다.")
    @CrossOrigin
    @PutMapping("/{userId}")
    public CommonResponse<Void> resetUser(@PathVariable Long userId) {
        userAdminBusiness.resetUserPw(userId);

        return CommonResponse.success();
    }

    @Operation(summary = "유저 관리자 권한 부여", description = "해당 유저에 관리자 권한을 부여합니다.")
    @CrossOrigin
    @PutMapping("/{userId}/role-admin")
    public CommonResponse<AdminUserResponse> addAdminRole(@PathVariable Long userId) {
        final AdminUserResponse response = userAdminBusiness.addAdminRoleToUser(userId);

        return CommonResponse.success(response);
    }

    @Operation(summary = "유저 모듈 권한 부여", description = "해당 유저에 모듈 사용 권한을 부여합니다.")
    @CrossOrigin
    @PutMapping("/{userId}/role-all")
    public CommonResponse<AdminUserResponse> addAllModuleRole(@PathVariable Long userId) {
        final AdminUserResponse response = userAdminBusiness.addAllModuleRoleToUser(userId);

        return CommonResponse.success(response);
    }

    @Operation(summary = "유저 관리자 권한 삭제", description = "해당 유저의 관리자 권한을 삭제합니다.")
    @CrossOrigin
    @DeleteMapping("/{userId}/role-admin")
    public CommonResponse<AdminUserResponse> deleteAdminRole(@PathVariable Long userId) {
        final AdminUserResponse response = userAdminBusiness.removeAdminRoleFromUser(userId);

        return CommonResponse.success(response);
    }

    @Operation(summary = "유저 모듈 권한 삭제", description = "해당 유저의 모듈 사용 권한을 삭제합니다.")
    @CrossOrigin
    @DeleteMapping("/{userId}/role-all")
    public CommonResponse<AdminUserResponse> deleteAllModuleRole(@PathVariable Long userId) {
        final AdminUserResponse response = userAdminBusiness.removeAllModuleRoleFromUser(userId);

        return CommonResponse.success(response);
    }

    @Operation(summary = "회원 탈퇴", description = "해당 유저의 탈퇴를 진행합니다.")
    @CrossOrigin
    @DeleteMapping("/{userId}")
    public CommonResponse<Void> signOutUser(@PathVariable Long userId) {
        userAdminBusiness.signOutUser(userId);

        return CommonResponse.success();
    }
}

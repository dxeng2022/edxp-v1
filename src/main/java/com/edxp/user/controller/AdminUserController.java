package com.edxp.user.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp.user.dto.response.AdminUserResponse;
import com.edxp.user.service.AdminUserService;
import com.edxp.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/v1/user")
@RestController
public class AdminUserController {
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

    @CrossOrigin
    @DeleteMapping("/{userId}")
    public CommonResponse<Void> signOutUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return CommonResponse.success();
    }
}

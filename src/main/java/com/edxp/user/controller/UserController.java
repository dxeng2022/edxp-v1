package com.edxp.user.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp.session.dto.response.SessionInfoResponse;
import com.edxp.user.business.UserBusiness;
import com.edxp.user.dto.request.UserChangeRequest;
import com.edxp.user.dto.request.UserCheckRequest;
import com.edxp.user.dto.request.UserFindRequest;
import com.edxp.user.dto.request.UserSignUpRequest;
import com.edxp.user.dto.response.GoKAISTResponse;
import com.edxp.user.dto.response.UserFindResponse;
import com.edxp.user.dto.response.UserInfoResponse;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Tag(name = "1-1. [사용자]", description = "로그인, 회원가입, 사용자 정보, 회원 탈퇴 등 사용자 관련 기능입니다.")
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
@RestController
public class UserController {
    private final UserBusiness userBusiness;

    @Operation(summary = "타공종 모듈 이동", description = "타공종 모듈로 이동합니다.")
    @PostMapping("/go-doc")
    public CommonResponse<GoKAISTResponse> getKey(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        Optional<String> session = Arrays.stream(cookies)
                .filter(cookie -> "SESSION".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst();

        GoKAISTResponse response = new GoKAISTResponse(session.orElse("need login"));

        return CommonResponse.success(response);
    }

    @Operation(summary = "로그인 유저 리스트 조회", description = "로그인한 모든 사용자의 세션 정보를 조회합니다.")
    @CrossOrigin
    @GetMapping("/log-users")
    public CommonResponse<List<SessionInfoResponse>> currentUsers() {
        List<SessionInfoResponse> currentUsers = userBusiness.getSessionUsers();

        return CommonResponse.success(currentUsers);
    }

    @Operation(summary = "로그인 유저 세션 조회", description = "로그인한 사용자의 세션 정보를 조회합니다.")
    @CrossOrigin
    @GetMapping("/log-user")
    public CommonResponse<SessionInfoResponse> currentUser(@RequestParam("username") String username) {
        SessionInfoResponse currentUser = userBusiness.getSessionUser(username);

        return CommonResponse.success(currentUser);
    }

    @Operation(summary = "내 정보 조회", description = "로그인한 사용자의 정보를 조회합니다.")
    @CrossOrigin
    @GetMapping("/my-info")
    public CommonResponse<UserInfoResponse> userMyPage(
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal
    ) {
        final UserInfoResponse response = userBusiness.getMyPage(principal.getUser());

        return CommonResponse.success(response);
    }

    @Operation(summary = "회원가입", description = "회원가입을 진행합니다.")
    @CrossOrigin
    @PostMapping("/sign-up")
    public CommonResponse<UserInfoResponse> signUpUser(@RequestBody UserSignUpRequest request) {
        final UserInfoResponse response = userBusiness.signUpUser(request);

        return CommonResponse.success(response);
    }

    @Operation(summary = "이메일 중복확인", description = "회원가입 시 이메일 중복을 확인합니다.")
    @CrossOrigin
    @PostMapping("/check-dupl")
    public CommonResponse<Void> checkDuplicated(@RequestBody UserCheckRequest request) {
        userBusiness.checkUsernameDuplicated(request);

        return CommonResponse.success();
    }

    @Operation(summary = "인증코드 메일 발송", description = "회원가입 시 인증코드 메일을 발송합니다.")
    @CrossOrigin
    @PostMapping("/signup-auth")
    public CommonResponse<Void> sendAuthMail(@RequestBody UserCheckRequest request) {
        userBusiness.sendAuthEmail(request);

        return CommonResponse.success();
    }

    @Operation(summary = "인증코드 확인", description = "회원가입 시 인증코드를 서버와 확인합니다.")
    @CrossOrigin
    @PostMapping("/signup-authcheck")
    public CommonResponse<Void> authCheck(@RequestBody UserCheckRequest request) {
        userBusiness.authCheck(request);

        return CommonResponse.success();
    }

    @Operation(summary = "이메일 찾기", description = "유저정보로 이메일을 조회합니다.")
    @CrossOrigin
    @PostMapping("/find-mail")
    public CommonResponse<UserFindResponse> findMail(@RequestBody UserFindRequest request) {
        final UserFindResponse response = userBusiness.findMail(request);

        return CommonResponse.success(response);
    }

    @Operation(summary = "비밀번호 찾기", description = "유저정보로 비밀번호를 초기화하고 메일을 발송합니다.")
    @CrossOrigin
    @PostMapping("/find-pw")
    public CommonResponse<Void> findPw(@RequestBody UserFindRequest request) {
        userBusiness.findPw(request);

        return CommonResponse.success();
    }

    @Operation(summary = "사용자 정보 변경", description = "비밀번호 또는 전화번호를 변경합니다.")
    @CrossOrigin
    @PutMapping("/{userId}")
    public CommonResponse<UserInfoResponse> changeInfo(
            @PathVariable Long userId,
            @RequestBody UserChangeRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal
    ) {
        final UserInfoResponse response = userBusiness.updateUserInfo(request, principal);

        return CommonResponse.success(response);
    }

    @Operation(summary = "회원 탈퇴", description = "회원탈퇴를 진행합니다.")
    @CrossOrigin
    @DeleteMapping("/{userId}")
    public CommonResponse<Void> signOutUser(
            @PathVariable Long userId,
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal
    ) {
        userBusiness.signOutUser(principal.getUser());

        return CommonResponse.success();
    }
}

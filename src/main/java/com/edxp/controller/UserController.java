package com.edxp.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp.dto.User;
import com.edxp.dto.request.UserChangeRequest;
import com.edxp.dto.request.UserCheckRequest;
import com.edxp.dto.request.UserFindRequest;
import com.edxp.dto.request.UserSignUpRequest;
import com.edxp.dto.response.SessionInfoResponse;
import com.edxp.dto.response.UserFindResponse;
import com.edxp.dto.response.UserInfoResponse;
import com.edxp.service.EmailSenderService;
import com.edxp.service.UserAuthService;
import com.edxp.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
@RestController
public class UserController {
    private final UserService userService;
    private final EmailSenderService emailSenderService;
    private final UserAuthService userAuthService;

    // 로그인 리스트 확인하기
    @CrossOrigin
    @GetMapping("/log-users")
    public CommonResponse<List<SessionInfoResponse>> currentUsers() {
        List<SessionInfoResponse> currentUsers = userService.getCurrentUsers();

        return CommonResponse.success(currentUsers);
    }

    // 로그인 유저 세션 확인하기
    @CrossOrigin
    @GetMapping("/log-user")
    public CommonResponse<SessionInfoResponse> currentUser(@RequestParam("sessionId") String sessionId) {
        SessionInfoResponse currentUser = userService.getCurrentUser(sessionId);

        return CommonResponse.success(currentUser);
    }

    // 로그인 정보 불러오기
    @CrossOrigin
    @GetMapping("/my-info")
    public CommonResponse<UserInfoResponse> userMyPage(@AuthenticationPrincipal PrincipalDetails principal) {
        return CommonResponse.success(UserInfoResponse.from(principal.getUser()));
    }

    // 회원가입
    @CrossOrigin
    @PostMapping("/sign-up")
    public CommonResponse<Void> signUpUser(@RequestBody UserSignUpRequest request) {
        userService.createUser(request);
        return CommonResponse.success();
    }

    // 이메일 중복확인
    @CrossOrigin
    @PostMapping("/check-dupl")
    public CommonResponse<Void> checkDuplicated(@RequestBody UserCheckRequest request) {
        userService.checkDuplicated(request);
        return CommonResponse.success();
    }

    // 인증번호 메일 발송요청
    @CrossOrigin
    @PostMapping("/signup-auth")
    public CommonResponse<Void> sendAuthMail(@RequestBody UserCheckRequest request) {
        String issuedCode = emailSenderService.sendAuthEmail(request);
        userAuthService.addAuthCode(request, issuedCode);
        return CommonResponse.success();
    }
    
    // 인증번호 확인 요청
    @CrossOrigin
    @PostMapping("/signup-authcheck")
    public CommonResponse<Void> authCheck(@RequestBody UserCheckRequest request) {
        userAuthService.getAuthCode(request);
        return CommonResponse.success();
    }

    // 유저 이메일 찾기
    @CrossOrigin
    @PostMapping("/find-mail")
    public CommonResponse<UserFindResponse> findMail(@RequestBody UserFindRequest request) {
        return CommonResponse.success(userService.findMail(request));
    }

    // 유저 비밀번호 찾기
    @CrossOrigin
    @PostMapping("/find-pw")
    public CommonResponse<Void> findPw(@RequestBody UserFindRequest request) {
        userService.findPw(request);
        return CommonResponse.success();
    }

    // 유저 비밀번호, 전화번호 변경
    @CrossOrigin
    @PutMapping("/{userId}")
    public CommonResponse<Void> changeInfo(
            @PathVariable Long userId,
            @RequestBody UserChangeRequest request,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        User user = userService.updateUser(userId, request);
        principal.setUser(user);
        return CommonResponse.success();
    }

    // 회원 탈퇴
    @CrossOrigin
    @DeleteMapping("/{userId}")
    public CommonResponse<Void> signOutUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return CommonResponse.success();
    }
}

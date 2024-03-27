package com.edxp.user.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp.user.dto.User;
import com.edxp.user.dto.request.UserChangeRequest;
import com.edxp.user.dto.request.UserCheckRequest;
import com.edxp.user.dto.request.UserFindRequest;
import com.edxp.user.dto.request.UserSignUpRequest;
import com.edxp.user.dto.response.GoKAISTResponse;
import com.edxp.session.dto.response.SessionInfoResponse;
import com.edxp.user.dto.response.UserFindResponse;
import com.edxp.user.dto.response.UserInfoResponse;
import com.edxp._core.common.providor.EmailSenderProvidor;
import com.edxp.user.service.UserAuthService;
import com.edxp.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
@RestController
public class UserController {
    private final UserService userService;
    private final UserAuthService userAuthService;
    private final EmailSenderProvidor emailSenderProvidor;

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
    public CommonResponse<SessionInfoResponse> currentUser(@RequestParam("username") String username) {
        SessionInfoResponse currentUser = userService.getCurrentUser(username);

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
        String issuedCode = emailSenderProvidor.sendAuthEmail(request);
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
    public CommonResponse<UserInfoResponse> changeInfo(
            @PathVariable Long userId,
            @RequestBody UserChangeRequest request,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        User user = userService.updateUser(userId, request, principal);

        return CommonResponse.success(UserInfoResponse.from(user));
    }

    // 회원 탈퇴
    @CrossOrigin
    @DeleteMapping("/{userId}")
    public CommonResponse<Void> signOutUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return CommonResponse.success();
    }
}

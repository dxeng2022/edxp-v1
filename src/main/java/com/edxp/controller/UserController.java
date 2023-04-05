package com.edxp.controller;

import com.edxp.common.response.CommonResponse;
import com.edxp.config.auth.PrincipalDetails;
import com.edxp.constant.ErrorCode;
import com.edxp.dto.User;
import com.edxp.dto.request.UserCheckRequest;
import com.edxp.dto.request.UserFindRequest;
import com.edxp.dto.request.UserSignUpRequest;
import com.edxp.dto.response.UserFindResponse;
import com.edxp.dto.response.UserInfoResponse;
import com.edxp.exception.EdxpApplicationException;
import com.edxp.service.EmailSenderService;
import com.edxp.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
@RestController
public class UserController {
    private final UserService userService;
    private final EmailSenderService emailSenderService;
    private String code;

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
        code = emailSenderService.sendEmail(request);
        log.info("인증코드: {}", code);
        return CommonResponse.success();
    }
    
    // 인증번호 확인 요청
    @CrossOrigin
    @PostMapping("/signup-authcheck")
    public CommonResponse<Void> authCheck(@RequestBody UserCheckRequest request) {
        String userAuthCode = request.getAuthCode();
        log.info("인증코드: {}, 유저입력코드: {}", code, userAuthCode);
        if (!code.equals(userAuthCode)) { throw new EdxpApplicationException(ErrorCode.INVALID_AUTH_CODE); }
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
}

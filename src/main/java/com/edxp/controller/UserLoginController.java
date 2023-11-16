package com.edxp.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp.dto.request.UserLoginRequest;
import com.edxp.dto.response.UserRSAResponse;
import com.edxp.service.UserLoginService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.security.PrivateKey;

@Slf4j
@RequiredArgsConstructor
@RestController
public class UserLoginController {
    private final UserLoginService userLoginService;

    // 로그인 여부 확인하기
    @CrossOrigin
    @GetMapping("/isLogin")
    public CommonResponse<Boolean> isUserLogin(@AuthenticationPrincipal PrincipalDetails principal) {
        if (principal != null) return CommonResponse.success(true);
        else return CommonResponse.success(false);
    }

    @GetMapping("/public-key")
    public CommonResponse<UserRSAResponse> getKeys(HttpServletRequest request) {
        HttpSession session = request.getSession();
        UserRSAResponse response = userLoginService.getRSAKeys();
        session.setAttribute("_RSA_WEB_Key_", response.getPrivateKey());
        return CommonResponse.success(response);
    }

    @PostMapping("/log")
    public CommonResponse<Void> getLog(HttpServletRequest request, @RequestBody UserLoginRequest loginRequest) {
        HttpSession session = request.getSession();
        PrivateKey privateKey = (PrivateKey) session.getAttribute("_RSA_WEB_Key_");
        userLoginService.login(privateKey, loginRequest);

        return CommonResponse.success();
    }
}

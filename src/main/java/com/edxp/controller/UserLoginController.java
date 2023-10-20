package com.edxp.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp.dto.request.UserLoginRequest;
import com.edxp.dto.response.UserRSAResponse;
import com.edxp.service.UserLoginService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.security.PrivateKey;

@Slf4j
@RequiredArgsConstructor
@RestController
public class UserLoginController {
    private final UserLoginService userLoginService;

    @GetMapping("/public-key")
    public CommonResponse<UserRSAResponse> getKeys(HttpServletRequest request) {
        HttpSession session = request.getSession();
        UserRSAResponse response = userLoginService.getRSAKeys();
        System.out.println(response.getPublicKeyModulus());
        session.setAttribute("_RSA_WEB_Key_", response.getPrivateKey());
        return CommonResponse.success(response);
    }

    @PostMapping("/log")
    public CommonResponse<Void> getLog(HttpServletRequest request, @RequestBody UserLoginRequest authRequest) {
        HttpSession session = request.getSession();
        PrivateKey privateKey = (PrivateKey) session.getAttribute("_RSA_WEB_Key_");

        String _pwd = userLoginService.decryptRSAKey(privateKey, authRequest.getPassword());
        userLoginService.login(authRequest.getUsername(), _pwd);

        return CommonResponse.success();
    }
}

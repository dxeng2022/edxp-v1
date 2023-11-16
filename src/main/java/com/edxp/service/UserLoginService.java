package com.edxp.service;

import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.dto.request.UserLoginRequest;
import com.edxp.dto.response.UserRSAResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.util.Base64;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserLoginService {
    private final AuthenticationManager authenticationManager;

    // RSA generator
    public UserRSAResponse getRSAKeys() {
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            KeyPair keyPair = generator.genKeyPair();
            PublicKey publicKey = keyPair.getPublic();
            PrivateKey privateKey = keyPair.getPrivate();
            String publicKeyBase64 = Base64.getEncoder().encodeToString(publicKey.getEncoded());

            return UserRSAResponse.from(privateKey, publicKeyBase64, null);
        } catch (NoSuchAlgorithmException e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "RSA Key 생성에 실패하였습니다.");
        }
    }

    public String decryptRSAKey(PrivateKey privateKey, String securedValue) {
        String decryptedValue;
        try {
            byte[] encryptedBytes = Base64.getDecoder().decode(securedValue);

            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
            decryptedValue = new String(decryptedBytes, StandardCharsets.UTF_8); // 문자 인코딩 주의.
        } catch (Exception e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "RSA Key 전달에 실패하였습니다.");
        }

        return decryptedValue;
    }

    public void login(PrivateKey privatekey, UserLoginRequest loginRequest) {
        String decPassword = decryptRSAKey(privatekey, loginRequest.getPassword());

        Authentication authentication = new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), decPassword);

        try {
            authentication = authenticationManager.authenticate(authentication);

            // 인증에 성공하면 SecurityContext 에 Authentication 객체를 설정합니다.
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (AuthenticationException e) {
            // 로그인 실패
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "로그인에 실패하였습니다.");
        }
    }
}

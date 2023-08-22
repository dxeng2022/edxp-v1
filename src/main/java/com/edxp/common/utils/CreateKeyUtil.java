package com.edxp.common.utils;

import lombok.extern.slf4j.Slf4j;

import java.util.Random;

@Slf4j
public class CreateKeyUtil {
    // 이메일 인증 키 생성
    public static String createAuthKey() {
        StringBuilder key = new StringBuilder();
        Random rnd = new Random();

        for (int i = 0; i < 8; i++) {
            int index = rnd.nextInt(3);

            switch (index) {
                case 0:
                    key.append((char) ((rnd.nextInt(26)) + 97));
                    break;
                case 1:
                    key.append((char) ((rnd.nextInt(26)) + 65));
                    break;
                case 2:
                    key.append(rnd.nextInt(10));
                    break;
            }
        }
        return key.toString();
    }
    
    // 신규 비밀번호 생성
    public static String createPwKey() {
        StringBuilder key = new StringBuilder();
        Random rnd = new Random();

        for (int i = 0; i < 8; i++) {
            int index = rnd.nextInt(3);

            if (i < 6) {
                switch (index) {
                    case 0:
                        key.append((char) ((rnd.nextInt(26)) + 97));
                        break;
                    case 1:
                        key.append((char) ((rnd.nextInt(26)) + 65));
                        break;
                    case 2:
                        key.append(rnd.nextInt(10));
                        break;
                }
            } else {
                int[] arr = {33, 64, 35, 36};
                key.append((char) arr[(rnd.nextInt(4))]);
            }
        }

        return key.toString();
    }
}

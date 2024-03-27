package com.edxp.user.service;

import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.user.entity.UserEntity;
import com.edxp.user.dto.User;
import com.edxp.user.repository.UserRepository;
import com.edxp._core.common.providor.EmailSenderProvidor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import static com.edxp._core.common.utils.CreateKeyUtil.createPwKey;

@Slf4j
@RequiredArgsConstructor
@Service
public class AdminUserService {
    private final UserRepository userRepository;
    private final EmailSenderProvidor emailSenderProvidor;

    private final BCryptPasswordEncoder encoder;

    @Transactional(readOnly = true)
    public List<User> users() {
        return userRepository.findAll().stream().map(User::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public void resetUserPw(Long userId) {
        UserEntity userEntity = userRepository.findById(userId).orElseThrow(() ->
                new EdxpApplicationException(ErrorCode.USER_NOT_FOUND)
        );

        String rawPassword = createPwKey();

        boolean isSentEmail = emailSenderProvidor.sendEmailWithNewPassword(userEntity.getUsername(), rawPassword);
        if (isSentEmail) {
            String encPassword = encoder.encode(rawPassword);
            log.debug("초기화된 비밀번호: {}", rawPassword);
            userEntity.setPassword(encPassword);
        } else {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Sending mail is failed");
        }
    }
}

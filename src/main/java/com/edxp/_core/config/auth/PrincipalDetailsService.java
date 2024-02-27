package com.edxp._core.config.auth;

import com.edxp._core.constant.ErrorCode;
import com.edxp.user.entity.UserEntity;
import com.edxp.user.dto.User;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class PrincipalDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        log.info("로그인 시도 - username: {}", username);
        UserEntity userEntity = userRepository.findByUsername(username).orElseThrow(() ->
                new EdxpApplicationException(ErrorCode.USER_NOT_FOUND, String.format("%s not founded", username)));
        return new PrincipalDetails(User.fromEntity(userEntity));
    }
}

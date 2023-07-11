package com.edxp.config.auth;

import com.edxp.constant.ErrorCode;
import com.edxp.domain.UserEntity;
import com.edxp.dto.User;
import com.edxp.exception.EdxpApplicationException;
import com.edxp.repository.UserRepository;
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
        log.info("로그인 성공 - principal: {}", User.fromEntity(userEntity).getUsername());
        return new PrincipalDetails(User.fromEntity(userEntity));
    }
}

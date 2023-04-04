package com.edxp.service;

import com.edxp.constant.ErrorCode;
import com.edxp.dto.request.UserCheckRequest;
import com.edxp.exception.EdxpApplicationException;
import com.edxp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;

    public void checkDuplicated(UserCheckRequest request) {
        userRepository.findByUsername(request.getUsername()).ifPresent(it -> {
           throw new EdxpApplicationException(ErrorCode.DUPLICATED_USER_NAME, String.format("%s is duplicated", request.getUsername()));
        });
    }
}

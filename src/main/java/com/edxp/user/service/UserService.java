package com.edxp.user.service;

import com.edxp._core.common.providor.EmailSenderProvidor;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.constant.RoleType;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.user.converter.UserConverter;
import com.edxp.user.dto.User;
import com.edxp.user.dto.request.UserChangeRequest;
import com.edxp.user.dto.request.UserCheckRequest;
import com.edxp.user.dto.request.UserFindRequest;
import com.edxp.user.dto.request.UserSignUpRequest;
import com.edxp.user.entity.UserEntity;
import com.edxp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.edxp._core.common.utils.CreateKeyUtil.createPwKey;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMailAuthCodeService userMailAuthCodeService;
    private final UserConverter userConverter;

    private final EmailSenderProvidor emailSenderProvidor;
    private final BCryptPasswordEncoder encoder;

    // 회원 가입
    @Transactional
    public User createUser(UserSignUpRequest request) {
        final UserEntity entity = userConverter.toEntity(request, encoder);

        userRepository.save(entity);
        userMailAuthCodeService.removeAuthCode(request.getUsername());

        return User.fromEntity(entity);
    }

    // 회원정보 변경
    @Transactional
    public User updateUser(User user, UserChangeRequest request) {
        UserEntity entity = userRepository.findById(user.getId()).orElseThrow(() ->
                new EdxpApplicationException(ErrorCode.USER_NOT_FOUND));

        String encPassword = null;
        if (!ObjectUtils.isEmpty(request.getNewPassword())) {
            encPassword = encoder.encode(request.getNewPassword());
        }

        entity.updateUserInfo(encPassword, request.getPhone());

        final UserEntity saveEntity = userRepository.save(entity);

        return User.fromEntity(saveEntity);
    }

    // 이메일 중복확인
    @Transactional(readOnly = true)
    public void checkDuplicated(UserCheckRequest request) {
        userRepository.findByUsername(request.getUsername()).ifPresent(it -> {
            throw new EdxpApplicationException(ErrorCode.DUPLICATED_USER_NAME, String.format("%s is duplicated", request.getUsername()));
        });
    }

    // 이메일 찾기
    @Transactional(readOnly = true)
    public String findMail(UserFindRequest request) {
        UserEntity entity = userRepository.findByNameAndPhoneAndBirth(request.getName(), request.getPhone(), request.getBirth()).orElseThrow(() ->
                new EdxpApplicationException(ErrorCode.USER_NOT_FOUND)
        );

        return entity.getUsername();
    }

    // 비밀번호 찾기
    @Transactional
    public void findPw(UserFindRequest request) {
        UserEntity userEntity = userRepository.findByUsernameAndNameAndPhoneAndBirth(request.getUsername(), request.getName(), request.getPhone(), request.getBirth()).orElseThrow(() ->
                new EdxpApplicationException(ErrorCode.USER_NOT_FOUND)
        );

        String rawPassword = createPwKey();
        boolean isSentEmail = emailSenderProvidor.sendEmailWithNewPassword(request.getUsername(), rawPassword);

        if (isSentEmail) {
            log.debug("초기화된 비밀번호: {}", rawPassword);
            String encPassword = encoder.encode(rawPassword);
            userEntity.updatePassword(encPassword);
        } else {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Sending mail is failed");
        }
    }

    // 회원 탈퇴
    @Transactional
    public void deleteUser(Long userId) {
        UserEntity entity = userRepository.findById(userId).orElseThrow(() ->
                new EdxpApplicationException(ErrorCode.USER_NOT_FOUND)
        );

        entity.updateUsername(entity.getUsername() + "_deleted");
        entity.updateDeletedAt();
    }

    // 전체 유저 찾기
    @Transactional(readOnly = true)
    public List<User> users() {

        return userRepository.findAll().stream().map(User::fromEntity).collect(Collectors.toList());
    }

    // 유저 1명 조회
    @Transactional(readOnly = true)
    public User getUser(Long userId) {
        UserEntity userEntity = userRepository.findById(userId).orElseThrow(() ->
                new EdxpApplicationException(ErrorCode.USER_NOT_FOUND)
        );

        return User.fromEntity(userEntity);
    }

    // 유저 비밀번호 초기화
    @Transactional
    public void resetUserPw(Long userId) {
        UserEntity userEntity = userRepository.findById(userId).orElseThrow(() ->
                new EdxpApplicationException(ErrorCode.USER_NOT_FOUND)
        );

        String rawPassword = createPwKey();

        boolean isSentEmail = emailSenderProvidor.sendEmailWithNewPassword(userEntity.getUsername(), rawPassword);

        if (!isSentEmail) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Sending mail is failed");
        }

        String encPassword = encoder.encode(rawPassword);
        log.debug("초기화된 비밀번호: {}", rawPassword);
        userEntity.updatePassword(encPassword);
    }

    // 유저 권한 추가
    @Transactional
    public User addRolesToUser(Long userId, List<RoleType> roleTypes) {
        UserEntity entity = userRepository.findById(userId).orElseThrow(() ->
                new EdxpApplicationException(ErrorCode.USER_NOT_FOUND));

        List<RoleType> newRoles = entity.getRoles();

        for (RoleType roleType : roleTypes) {
            if (!newRoles.contains(roleType)) {
                newRoles.add(roleType);
            }
        }

        entity.updateRoles(newRoles);

        return User.fromEntity(userRepository.save(entity));
    }

    // 유저 권한 삭제
    @Transactional
    public User removeRolesFromUser(Long userId, List<RoleType> roleTypes) {
        UserEntity entity = userRepository.findById(userId).orElseThrow(() ->
                new EdxpApplicationException(ErrorCode.USER_NOT_FOUND));

        List<RoleType> newRoles = new ArrayList<>(entity.getRoles());

        for (RoleType roleType : roleTypes) {
            newRoles.remove(roleType);
        }

        entity.updateRoles(newRoles);

        return User.fromEntity(userRepository.save(entity));
    }
}

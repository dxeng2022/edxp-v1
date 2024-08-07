package com.edxp.user.business;

import com.edxp._core.common.annotation.Business;
import com.edxp._core.common.providor.EmailSenderProvidor;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp.session.dto.response.SessionInfoResponse;
import com.edxp.user.converter.UserConverter;
import com.edxp.user.dto.User;
import com.edxp.user.dto.request.UserChangeRequest;
import com.edxp.user.dto.request.UserCheckRequest;
import com.edxp.user.dto.request.UserFindRequest;
import com.edxp.user.dto.request.UserSignUpRequest;
import com.edxp.user.dto.response.UserFindResponse;
import com.edxp.user.dto.response.UserInfoResponse;
import com.edxp.user.service.UserMailAuthCodeService;
import com.edxp.user.service.UserService;
import com.edxp.user.service.UserSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RequiredArgsConstructor
@Business
public class UserBusiness {
    private final UserService userService;
    private final UserSessionService userSessionService;
    private final UserConverter userConverter;

    private final UserMailAuthCodeService userMailAuthCodeService;
    private final EmailSenderProvidor emailSenderProvidor;

    /**
     * [ 전체 세션 유저 조회 ]
     *
     * @return 세션 유저 리스트
     * @since 24.08.07
     */
    public List<SessionInfoResponse> getSessionUsers() {

        return userSessionService.getCurrentUsers();
    }

    /**
     * [ 현재 세션 유저 조회 ]
     *
     * @param username 유저 이메일
     * @return 세션 정보
     * @since 24.08.07
     */
    public SessionInfoResponse getSessionUser(String username) {

        return userSessionService.getCurrentUser(username);
    }

    /**
     * [ 유저 정보 조회 ]
     *
     * @param user 로그인 유저
     * @return 유저 정보
     * @since 24.08.07
     */
    public UserInfoResponse getMyPage(User user) {

        return userConverter.toResponse(user);
    }

    /**
     * [ 회원 가입 ]
     * @param request 회원가입 정보
     * @return 가입 완료 유저 정보
     * @since 24.08.07
     */
    public UserInfoResponse signUpUser(UserSignUpRequest request) {
        final User user = userService.createUser(request);

        return userConverter.toResponse(user);
    }

    /**
     * [ 유저 정보 업데이트 ]
     *
     * @param request 변경할 유저 정보
     * @param principal 로그인 유저 정보
     * @return 변경된 유저 정보
     * @since 24.08.07
     */
    public UserInfoResponse updateUserInfo(UserChangeRequest request, PrincipalDetails principal) {
        final User user = userService.updateUser(principal.getUser(), request);

        principal.setUser(user);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Authentication updatedAuthentication = new UsernamePasswordAuthenticationToken(principal, authentication.getCredentials(), principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(updatedAuthentication);

        return userConverter.toResponse(principal.getUser());
    }

    // 회원가입 메일 중복 확인
    public void checkUsernameDuplicated(UserCheckRequest request) {
        userService.checkDuplicated(request);
    }

    // 회원가입 인증메일 전송
    public void sendAuthEmail(UserCheckRequest request) {
        String issuedCode = emailSenderProvidor.sendAuthEmail(request);
        userMailAuthCodeService.addAuthCode(request, issuedCode);
    }

    // 회원가입 인증 메일 인증코드 확인
    public void authCheck(UserCheckRequest request) {
        userMailAuthCodeService.getAuthCode(request);
    }

    // 이메일 찾기
    public UserFindResponse findMail(UserFindRequest request) {
        final String username = userService.findMail(request);

        return UserFindResponse.of(username);
    }

    // 비밀번호 초기화
    public void findPw(UserFindRequest request) {
        userService.findPw(request);
    }

    // 회원 탈퇴
    public void signOutUser(User user) {
        userService.deleteUser(user.getId());
    }
}

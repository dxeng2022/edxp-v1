package com.edxp.user.service;

import com.edxp.session.dto.SessionInfo;
import com.edxp.session.dto.response.SessionInfoResponse;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserSessionService {
    private final JdbcTemplate jdbcTemplate;

    // 전체 세션 리스트 확인
    @Transactional(readOnly = true)
    public List<SessionInfoResponse> getCurrentUsers() {
        // Spring Session JDBC 를 사용하여 현재 로그인한 사용자 정보를 조회하는 쿼리를 작성합니다.
        String query = "SELECT * FROM SPRING_SESSION";

        // 쿼리를 실행하여 로그인한 사용자 목록을 가져옵니다.
        return jdbcTemplate.query(query, (rs, rowNum) -> {
            SessionInfo sessionInfo = SessionInfo.builder()
                    .sessionId(rs.getString("session_id"))
                    .username(rs.getString("principal_name"))
                    .creationTime(rs.getLong("creation_time"))
                    .expiryTime(rs.getLong("expiry_time"))
                    .build();

            return SessionInfoResponse.from(sessionInfo);
        });
    }

    // 유저 세션 정보 확인
    @Transactional(readOnly = true)
    public SessionInfoResponse getCurrentUser(String username) {
        String query = "SELECT * FROM SPRING_SESSION WHERE PRINCIPAL_NAME = ?";

        RowMapper<SessionInfo> rowMapper = (rs, rowNum) ->
                SessionInfo.builder()
                        .sessionId(rs.getString("session_id"))
                        .username(rs.getString("principal_name"))
                        .creationTime(rs.getLong("creation_time"))
                        .expiryTime(rs.getLong("expiry_time"))
                        .build();

        SessionInfo sessionInfo;

        try {
            sessionInfo = jdbcTemplate.queryForObject(query, rowMapper, username);
        } catch (EmptyResultDataAccessException e) {
            sessionInfo = null;
        }

        if (!ObjectUtils.isEmpty(sessionInfo)) {
            return SessionInfoResponse.from(sessionInfo);
        }

        return new SessionInfoResponse();
    }
}

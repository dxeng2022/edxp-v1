package com.edxp.dto.response;

import com.edxp.domain.SessionInfo;
import lombok.Builder;
import lombok.Getter;

import java.text.SimpleDateFormat;
import java.util.Date;

@Builder
@Getter
public class SessionInfoResponse {
    private String sessionId;
    private String principalName;
    private String creationTime;
    private String expiryTime;
    private long originCreationTime;
    private long originExpiryTime;

    public static SessionInfoResponse from(SessionInfo sessionInfo) {
        Date creation = new Date(sessionInfo.getCreationTime());
        Date expiry = new Date(sessionInfo.getExpiryTime());
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String formattedCreation = dateFormat.format(creation);
        String formattedExpiry = dateFormat.format(expiry);

        return new SessionInfoResponse(
                sessionInfo.getSessionId(),
                sessionInfo.getPrincipalName(),
                formattedCreation,
                formattedExpiry,
                sessionInfo.getCreationTime(),
                sessionInfo.getExpiryTime()
        );
    }
}

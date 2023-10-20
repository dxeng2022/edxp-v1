package com.edxp.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.security.PrivateKey;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserRSAResponse {
    @JsonIgnore
    private PrivateKey privateKey;
    private String publicKeyModulus;
    private String publicKeyExponent;

    public static UserRSAResponse from (
            PrivateKey privateKey, String publicKeyModulus, String publicKeyExponent
    ) {
        return new UserRSAResponse(
                privateKey,
                publicKeyModulus,
                publicKeyExponent
        );
    }
}

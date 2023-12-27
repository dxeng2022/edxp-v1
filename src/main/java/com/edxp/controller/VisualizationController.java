package com.edxp.controller;

import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.dto.request.VisualizationDrawRequest;
import com.edxp.service.VisualizationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/visual")
@RestController
public class VisualizationController {
    private final VisualizationService visualizationService;

    @CrossOrigin
    @PostMapping("/result-draw")
    public ResponseEntity<Object> downloadWithJson(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody VisualizationDrawRequest request
    ) throws IOException {
        if (principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);

        log.debug("fileName : {}", request.getFileName());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_MIXED);

        final MultiValueMap<String, Object> body = visualizationService.getResultDraw(principal.getUser().getId(), request);

        return ResponseEntity.ok()
                .headers(headers)
                .body(body);
    }
}

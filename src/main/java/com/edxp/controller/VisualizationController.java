package com.edxp.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.dto.request.VisualizationDrawRequest;
import com.edxp.dto.response.VisualizationDrawResponse;
import com.edxp.service.VisualizationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/visual")
@RestController
public class VisualizationController {
    private final VisualizationService visualizationService;

    @CrossOrigin
    @GetMapping("/result-draw")
    public CommonResponse<VisualizationDrawResponse> resultDraw(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody VisualizationDrawRequest request
    ) throws IOException {
        if (principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        final VisualizationDrawResponse response = visualizationService.getResultDraw(principal.getUser().getId(), request);
        return CommonResponse.success(response);
    }
}

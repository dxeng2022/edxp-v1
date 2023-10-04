package com.edxp.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp._core.constant.ErrorCode;
import com.edxp.domain.ParsedDocument;
import com.edxp.dto.request.RiskAnalyzeRequest;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.service.RiskExtractService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/doc")
@RestController
public class RiskExtractController {
    private final RiskExtractService riskExtractService;

    @PostMapping("/parser")
    public ResponseEntity<List<ParsedDocument>> requestParse(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestPart(value = "file") MultipartFile file
    ) throws IOException {
        if (principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        Map<String, List<ParsedDocument>> response = riskExtractService.parse(principal.getUser().getId(), file);
        String fileName = null;

        for (String key : response.keySet()) fileName = key;

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header("Content-Disposition", "attachment; filename=" + fileName)
                .body(response.get(fileName));
    }

    @PostMapping("/analysis")
    public CommonResponse<List<ParsedDocument>> requestAnalysis(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody RiskAnalyzeRequest request
    ) throws IOException {
        if (principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        return CommonResponse.success(riskExtractService.analysis(principal.getUser().getId(), request));
    }
}

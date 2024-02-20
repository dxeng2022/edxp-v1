package com.edxp.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.dto.request.RiskAnalyzeRequest;
import com.edxp.dto.request.VisualizationDocRequest;
import com.edxp.dto.response.VisualizationDocParseResponse;
import com.edxp.dto.response.VisualizationDocRiskResponse;
import com.edxp.service.RiskExtractService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/doc")
@RestController
public class RiskExtractController {
    private final RiskExtractService riskExtractService;

    @CrossOrigin
    @PostMapping("/parser-pdf")
    public ResponseEntity<FileSystemResource> requestParsePdf(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody VisualizationDocRequest request
    ) {
        Map<String, FileSystemResource> response = riskExtractService.parseDown(principal.getUser().getId(), request);

        String filePath = null;
        for (String key : response.keySet()) filePath = key;

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header("Content-Disposition", "attachment; filePath=" + filePath)
                .body(response.get(filePath));
    }

    @CrossOrigin
    @PostMapping("/parser")
    public ResponseEntity<VisualizationDocParseResponse> requestParse(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody VisualizationDocRequest request
    ) throws IOException {
        Map<String, VisualizationDocParseResponse> response = riskExtractService.parseExecute(principal.getUser().getId(), request);

        String fileName = null;
        for (String key : response.keySet()) fileName = key;

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header("Content-Disposition", "attachment; filename=" + fileName)
                .body(response.get(fileName));
    }

    @CrossOrigin
    @PostMapping("/parser-loc")
    public ResponseEntity<VisualizationDocParseResponse> requestParseLocal(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        if (file == null) throw new EdxpApplicationException(ErrorCode.FILE_NOT_ATTACHED);
        Map<String, VisualizationDocParseResponse> response = riskExtractService.parse(principal.getUser().getId(), file);

        String fileName = null;
        for (String key : response.keySet()) fileName = key;

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header("Content-Disposition", "attachment; filename=" + fileName)
                .body(response.get(fileName));
    }

    @CrossOrigin
    @PostMapping("/analysis")
    public CommonResponse<VisualizationDocRiskResponse> requestAnalysis(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody RiskAnalyzeRequest request
    ) throws IOException {
        return CommonResponse.success(riskExtractService.analysis(principal.getUser().getId(), request));
    }

    @CrossOrigin
    @DeleteMapping("/parser-delete")
    public CommonResponse<Void> deleteFile(
            @AuthenticationPrincipal PrincipalDetails principal
    ) throws IOException {
        riskExtractService.deleteResult(principal.getUser().getId());

        return CommonResponse.success();
    }
}

package com.edxp.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp.dto.request.VisualizationDrawRequest;
import com.edxp.dto.response.VisualizationDrawResponse;
import com.edxp.service.VisualizationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/visual")
@RestController
public class VisualizationController {
    private final VisualizationService visualizationService;

    @CrossOrigin
    @PostMapping("/result-draw")
    public CommonResponse<VisualizationDrawResponse> downloadJson(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody VisualizationDrawRequest request
    ) throws IOException {
        final VisualizationDrawResponse response = visualizationService.getResultDraw(principal.getUser().getId(), request);

        return CommonResponse.success(response);
    }

    @CrossOrigin
    @PostMapping("/result-loc")
    public CommonResponse<VisualizationDrawResponse> downloadLocal(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestPart("file") MultipartFile multipartFile
    ) throws IOException {
        final VisualizationDrawResponse response = visualizationService.getResultLocal(principal.getUser().getId(), multipartFile);

        return CommonResponse.success(response);
    }

    @CrossOrigin
    @PostMapping("/result-img")
    public ResponseEntity<Object> downloadImage(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody VisualizationDrawRequest request
    ) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        final FileSystemResource resultImage = visualizationService.getResultImage(principal.getUser().getId(), request);

        return ResponseEntity.ok()
                .headers(headers)
                .body(resultImage);
    }

    @CrossOrigin
    @DeleteMapping("/result-delete")
    public CommonResponse<Void> deleteResult(
            @AuthenticationPrincipal PrincipalDetails principal
    ) throws IOException {
        visualizationService.deleteResult(principal.getUser().getId());

        return CommonResponse.success();
    }
}

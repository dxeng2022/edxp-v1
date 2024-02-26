package com.edxp.order.draw.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp.order.draw.dto.request.OrderDrawRequest;
import com.edxp.order.draw.dto.response.OrderDrawResponse;
import com.edxp.order.draw.service.OrderDrawService;
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
public class OrderDrawController {
    private final OrderDrawService orderDrawService;

    @CrossOrigin
    @PostMapping("/result-draw")
    public CommonResponse<OrderDrawResponse> downloadJson(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDrawRequest request
    ) throws IOException {
        final OrderDrawResponse response = orderDrawService.getResultDraw(principal.getUser().getId(), request);

        return CommonResponse.success(response);
    }

    @CrossOrigin
    @PostMapping("/result-loc")
    public CommonResponse<OrderDrawResponse> downloadLocal(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestPart("file") MultipartFile multipartFile
    ) throws IOException {
        final OrderDrawResponse response = orderDrawService.getResultLocal(principal.getUser().getId(), multipartFile);

        return CommonResponse.success(response);
    }

    @CrossOrigin
    @PostMapping("/result-img")
    public ResponseEntity<Object> downloadImage(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDrawRequest request
    ) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        final FileSystemResource resultImage = orderDrawService.getResultImage(principal.getUser().getId(), request);

        return ResponseEntity.ok()
                .headers(headers)
                .body(resultImage);
    }

    @CrossOrigin
    @DeleteMapping("/result-delete")
    public CommonResponse<Void> deleteResult(
            @AuthenticationPrincipal PrincipalDetails principal
    ) throws IOException {
        orderDrawService.deleteResult(principal.getUser().getId());

        return CommonResponse.success();
    }
}

package com.edxp.order.doc.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.order.doc.business.OrderDocBusiness;
import com.edxp.order.doc.dto.request.OrderDocParseRequest;
import com.edxp.order.doc.dto.request.OrderDocParseUpdateRequest;
import com.edxp.order.doc.dto.request.OrderDocRiskRequest;
import com.edxp.order.doc.dto.response.OrderDocListResponse;
import com.edxp.order.doc.dto.response.OrderDocParseResponse;
import com.edxp.order.doc.dto.response.OrderDocRiskResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
public class OrderDocController {
    private final OrderDocBusiness orderDocBusiness;

    // 주문 내용 조회
    @CrossOrigin
    @GetMapping
    public CommonResponse<?> getOrderDocList(
            @AuthenticationPrincipal PrincipalDetails principal,
            @PageableDefault(size = 50, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        final Page<OrderDocListResponse> response = orderDocBusiness.getOrderList(principal.getUser().getId(), pageable);

        return CommonResponse.success(response);
    }

    // pdf 요청
    @CrossOrigin
    @PostMapping("/parser-pdf")
    public ResponseEntity<FileSystemResource> getParsePdf(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocParseRequest request
    ) {
        Map<String, FileSystemResource> response = orderDocBusiness.parseDown(principal.getUser().getId(), request);

        String filePath = null;
        for (String key : response.keySet()) filePath = key;

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header("Content-Disposition", "attachment; filePath=" + filePath)
                .body(response.get(filePath));
    }

    // 클라우드 파싱 요청
    @CrossOrigin
    @PostMapping("/parser")
    public ResponseEntity<OrderDocParseResponse> parseCloud(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocParseRequest request
    ) throws IOException {
        Map<String, OrderDocParseResponse> response = orderDocBusiness.parseExecute(principal.getUser().getId(), request);

        String filename = null;
        for (String key : response.keySet()) filename = key;

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header("Content-Disposition", "attachment; filename=" + filename)
                .body(response.get(filename));
    }

    // 로컬 파싱 요청
    @CrossOrigin
    @PostMapping("/parser-loc")
    public ResponseEntity<OrderDocParseResponse> parseLocal(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        if (file == null) throw new EdxpApplicationException(ErrorCode.FILE_NOT_ATTACHED);
        Map<String, OrderDocParseResponse> response = orderDocBusiness.parse(principal.getUser().getId(), file);

        String filename = null;
        for (String key : response.keySet()) filename = key;

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header("Content-Disposition", "attachment; filename=" + filename)
                .body(response.get(filename));
    }

    // 문서 업데이트
    @CrossOrigin
    @PutMapping
    public ResponseEntity<OrderDocParseResponse> documentUpdate(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocParseUpdateRequest request
    ) throws IOException {
        final Map<String, OrderDocParseResponse> response = orderDocBusiness.documentUpdate(principal.getUser().getId(), request);

        String filename = null;
        for (String key : response.keySet()) filename = key;

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header("Content-Disposition", "attachment; filename=" + filename)
                .body(response.get(filename));
    }

    // 분석 요청
    @CrossOrigin
    @PostMapping("/analysis")
    public CommonResponse<OrderDocRiskResponse> requestAnalysis(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocRiskRequest request
    ) throws IOException {
        return CommonResponse.success(orderDocBusiness.analysis(principal.getUser().getId(), request));
    }

    // 시각화 요청
    @CrossOrigin
    @PostMapping("/visual")
    public CommonResponse<OrderDocRiskResponse> requestAnalysisVisualization(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocRiskRequest request
    ) throws IOException {
        return CommonResponse.success(orderDocBusiness.visualization(principal.getUser().getId(), request));
    }

    // 임시 파일 삭제
    @CrossOrigin
    @DeleteMapping("/parser-delete")
    public CommonResponse<Void> deleteFile(
            @AuthenticationPrincipal PrincipalDetails principal
    ) throws IOException {
        orderDocBusiness.deleteResult(principal.getUser().getId());

        return CommonResponse.success();
    }
}

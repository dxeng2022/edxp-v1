package com.edxp.order.doc.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.order.doc.business.OrderDocBusiness;
import com.edxp.order.doc.dto.request.*;
import com.edxp.order.doc.dto.response.OrderDocParseResponse;
import com.edxp.order.doc.dto.response.OrderDocResponse;
import com.edxp.order.doc.dto.response.OrderDocRiskResponse;
import com.edxp.order.doc.dto.response.OrderDocVisualListResponse;
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
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
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
        final Page<OrderDocResponse> response = orderDocBusiness.getOrderListWithPage(principal.getUser().getId(), pageable);

        return CommonResponse.success(response);
    }

    // 분석용 pdf 요청
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
    public CommonResponse<OrderDocParseResponse> parseCloud(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocParseRequest request
    ) throws IOException {
        OrderDocParseResponse response = orderDocBusiness.parseExecute(principal.getUser(), request);

        return CommonResponse.success(response);
    }

    // 로컬 파싱 요청
    @CrossOrigin
    @PostMapping("/parser-loc")
    public CommonResponse<OrderDocParseResponse> parseLocal(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        if (file == null) throw new EdxpApplicationException(ErrorCode.FILE_NOT_ATTACHED);

        OrderDocParseResponse response = orderDocBusiness.parse(principal.getUser(), "", file);

        return CommonResponse.success(response);
    }

    // 문서 업데이트
    @CrossOrigin
    @PutMapping
    public CommonResponse<Object> documentUpdate(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocParseUpdateRequest request
    ) {
        final Object response = orderDocBusiness.documentUpdate(principal.getUser(), request);

        return CommonResponse.success(response);
    }

    // 분석 요청
    @CrossOrigin
    @PostMapping("/analysis")
    public CommonResponse<OrderDocRiskResponse> requestAnalysis(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocRiskRequest request
    ) throws IOException {
        final OrderDocRiskResponse response = orderDocBusiness.analysis(principal.getUser(), request);

        return CommonResponse.success(response);
    }

    // 분석 요청
    @CrossOrigin
    @GetMapping("/analysis-event")
    public SseEmitter requestAnalysis2(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestParam String filename
    ) {
        return orderDocBusiness.analysisEmitter(principal.getUser(), filename);
    }

    // 시각화 파일 리스트 요청
    @CrossOrigin
    @GetMapping("/visual-list")
    public CommonResponse<List<OrderDocVisualListResponse>> getVisualList(
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        final List<OrderDocVisualListResponse> response = orderDocBusiness.visualList(principal.getUser().getId());

        return CommonResponse.success(response);
    }

    // 영구문서 시각화용 pdf 전달 api
    @CrossOrigin
    @PostMapping("/visual-pdf")
    public ResponseEntity<FileSystemResource> getVisualPdf(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocVisualRequest request
    ) {
        Map<String, FileSystemResource> response = orderDocBusiness.visualDown(principal.getUser().getId(), request);

        String filePath = null;
        for (String key : response.keySet()) filePath = key;

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header("Content-Disposition", "attachment; filePath=" + filePath)
                .body(response.get(filePath));
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

    // 로컬 시각화 요청
    @CrossOrigin
    @PostMapping("/visual-loc")
    public CommonResponse<OrderDocRiskResponse> visualLocal(
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        if (file == null) throw new EdxpApplicationException(ErrorCode.FILE_NOT_ATTACHED);

        OrderDocRiskResponse response = orderDocBusiness.visualizationLocal(file);

        return CommonResponse.success(response);
    }

    // 임시문서 -> 클라우드 저장 (수정할 이름 + key 이동, 용량체크 필요)
    @CrossOrigin
    @PutMapping("/visual-save")
    public CommonResponse<Void> saveTempResultFile(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocVisualSaveRequest request
    ) {
        orderDocBusiness.saveResult(principal.getUser().getId(), request);

        return CommonResponse.success();
    }

    // 임시 파일 삭제
    @CrossOrigin
    @DeleteMapping("/parser-delete")
    public CommonResponse<Void> deleteFile(
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        orderDocBusiness.deleteResult(principal.getUser().getId());

        return CommonResponse.success();
    }
}

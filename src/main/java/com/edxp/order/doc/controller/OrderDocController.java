package com.edxp.order.doc.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.order.doc.business.OrderDocBusiness;
import com.edxp.order.doc.dto.request.*;
import com.edxp.order.doc.dto.response.OrderDocCountResponse;
import com.edxp.order.doc.dto.response.OrderDocParseResponse;
import com.edxp.order.doc.dto.response.OrderDocResponse;
import com.edxp.order.doc.dto.response.OrderDocRiskResponse;
import com.edxp.order.doc.dto.response.OrderDocVisualListResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(name = "3-1. [문서 분석 모듈]", description = "문서 분석 모듈 관련 기능입니다.")
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/doc")
@RestController
public class OrderDocController {
    private final OrderDocBusiness orderDocBusiness;

    @Operation(summary = "문서 분석 이력 조회", description = "문서 분석을 진행한 이력을 조회합니다.")
    @CrossOrigin
    @GetMapping
    public CommonResponse<?> getOrderDocList(
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal,
            @PageableDefault(size = 50, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        final Page<OrderDocResponse> response = orderDocBusiness.getOrderListWithPage(principal.getUser().getId(), pageable);

        return CommonResponse.success(response);
    }

    @Operation(summary = "문서 파싱 횟수", description = "문서 파싱을 진행한 횟수를 조회합니다.")
    @GetMapping("/parse-count")
    public CommonResponse<OrderDocCountResponse> getParsingCount(
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal
    ) {
        final OrderDocCountResponse response = orderDocBusiness.getParsingCount(principal.getUser());

        return CommonResponse.success(response);
    }

    @Operation(summary = "문서 분석 횟수", description = "문서 분석을 진행한 횟수를 조회합니다.")
    @GetMapping("/analysis-count")
    public CommonResponse<OrderDocCountResponse> getExtractCount(
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal
    ) {
        final OrderDocCountResponse response = orderDocBusiness.getExtractCount(principal.getUser());

        return CommonResponse.success(response);
    }

    /**
     * [ 클라우드 파싱 순서 ]
     * <br/>
     * 1. pdf 다운 (/parser-pdf)
     * 2. 클라우드 파싱 요청 (/parser)
     * 3. 임시파일 삭제 (/parser-delete)
     *<br/>
     * [ 로컬 파싱 순서 ]
     *<br/>
     * 1. 로컬 파싱 요청 (/parser-loc)
     */

    @Operation(summary = "1) 파싱 pdf 다운로드", description = "클라우드 파싱 진행을 위해 pdf 를 다운로드 합니다.")
    @CrossOrigin
    @PostMapping("/parser-pdf")
    public ResponseEntity<FileSystemResource> getParsePdf(
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocParseRequest request
    ) {
        Map<String, FileSystemResource> response = orderDocBusiness.parseDown(principal.getUser(), request);

        String filePath = null;
        for (String key : response.keySet()) filePath = key;

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header("Content-Disposition", "attachment; filePath=" + filePath)
                .body(response.get(filePath));
    }

    @Operation(summary = "2) 클라우드 파싱 진행", description = "pdf 다운로드 후 클라우드 파싱을 진행 합니다.")
    @CrossOrigin
    @PostMapping("/parser")
    public CommonResponse<OrderDocParseResponse> parseCloud(
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocParseRequest request
    ) throws IOException {
        OrderDocParseResponse response = orderDocBusiness.parseExecute(principal.getUser(), request);

        return CommonResponse.success(response);
    }

    @Operation(summary = "로컬 파싱 진행", description = "로컬에서 pdf 를 전달받아 파싱을 진행합니다.")
    @CrossOrigin
    @PostMapping("/parser-loc")
    public CommonResponse<OrderDocParseResponse> parseLocal(
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        if (file == null) throw new EdxpApplicationException(ErrorCode.FILE_NOT_ATTACHED);

        OrderDocParseResponse response = orderDocBusiness.parse(principal.getUser(), "", file);

        return CommonResponse.success(response);
    }

    @Operation(summary = "파싱 문서 편집", description = "편집을 진행한 문서로 업데이트 합니다.")
    @CrossOrigin
    @PutMapping
    public CommonResponse<Object> documentUpdate(
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocParseUpdateRequest request
    ) {
        final Object response = orderDocBusiness.documentUpdate(principal.getUser(), request);

        return CommonResponse.success(response);
    }

    @Operation(summary = "문서 분석 요청", description = "위험 문장 분석을 진행합니다.")
    @CrossOrigin
    @PostMapping("/analysis")
    public CommonResponse<OrderDocRiskResponse> requestAnalysis(
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocRiskRequest request
    ) throws IOException {
        final OrderDocRiskResponse response = orderDocBusiness.analysis(principal.getUser(), request);

        return CommonResponse.success(response);
    }

    @Operation(summary = "문서 분석 요청 (대용량)", description = "문장수가 많은 문서의 위험 문장 분석을 진행합니다.")
    @CrossOrigin
    @GetMapping("/analysis-event")
    public SseEmitter requestAnalysis2(
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal,
            @RequestParam String filename
    ) {
        return orderDocBusiness.analysisEmitter(principal.getUser(), filename);
    }

    @Operation(summary = "임시문서함 리스트 요청", description = "임시 문서함의 리스트를 요청합니다.")
    @CrossOrigin
    @GetMapping("/visual-list")
    public CommonResponse<List<OrderDocVisualListResponse>> getVisualList(
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal
    ) {
        final List<OrderDocVisualListResponse> response = orderDocBusiness.visualList(principal.getUser().getId());

        return CommonResponse.success(response);
    }

    @Operation(summary = "시각화 pdf 요청", description = "영구 저장한 분석결과 파일의 pdf 를 불러옵니다.")
    @CrossOrigin
    @PostMapping("/visual-pdf")
    public ResponseEntity<FileSystemResource> getVisualPdf(
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal,
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

    @Operation(summary = "클라우드 시각화 요청", description = "클라우드에 있는 분석 결과의 시각화를 진행합니다.")
    @CrossOrigin
    @PostMapping("/visual")
    public CommonResponse<OrderDocRiskResponse> requestAnalysisVisualization(
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocRiskRequest request
    ) throws IOException {
        return CommonResponse.success(orderDocBusiness.visualization(principal.getUser().getId(), request));
    }

    @Operation(summary = "로컬 시각화 요청", description = "로컬에 있는 분석 결과의 시각화를 진행합니다.")
    @CrossOrigin
    @PostMapping("/visual-loc")
    public CommonResponse<OrderDocRiskResponse> visualLocal(
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        if (file == null) throw new EdxpApplicationException(ErrorCode.FILE_NOT_ATTACHED);

        OrderDocRiskResponse response = orderDocBusiness.visualizationLocal(file);

        return CommonResponse.success(response);
    }

    @Operation(summary = "임시 파일 저장", description = "임시문서함에 있는 결과파일을 클라우드로 이동합니다.")
    @CrossOrigin
    @PutMapping("/visual-save")
    public CommonResponse<Void> saveTempResultFile(
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocVisualSaveRequest request
    ) {
        orderDocBusiness.saveResult(principal.getUser(), request);

        return CommonResponse.success();
    }

    @Operation(summary = "3) 로컬 임시 파일 삭제", description = "로컬에 다운로드한 임시파일을 삭제합니다.")
    @CrossOrigin
    @DeleteMapping("/parser-delete")
    public CommonResponse<Void> deleteFile(
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal
    ) {
        orderDocBusiness.deleteResult(principal.getUser().getId());

        return CommonResponse.success();
    }
}

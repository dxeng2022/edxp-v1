package com.edxp.order.doc.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.order.doc.dto.request.OrderDocRiskRequest;
import com.edxp.order.doc.dto.request.OrderDocParseRequest;
import com.edxp.order.doc.dto.response.OrderDocParseResponse;
import com.edxp.order.doc.dto.response.OrderDocRiskResponse;
import com.edxp.order.doc.business.OrderDocBusiness;
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
public class OrderDocController {
    private final OrderDocBusiness orderDocBusiness;

    @CrossOrigin
    @PostMapping("/parser-pdf")
    public ResponseEntity<FileSystemResource> requestParsePdf(
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

    @CrossOrigin
    @PostMapping("/parser")
    public ResponseEntity<OrderDocParseResponse> requestParse(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocParseRequest request
    ) throws IOException {
        Map<String, OrderDocParseResponse> response = orderDocBusiness.parseExecute(principal.getUser().getId(), request);

        String fileName = null;
        for (String key : response.keySet()) fileName = key;

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header("Content-Disposition", "attachment; filename=" + fileName)
                .body(response.get(fileName));
    }

    @CrossOrigin
    @PostMapping("/parser-loc")
    public ResponseEntity<OrderDocParseResponse> requestParseLocal(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        if (file == null) throw new EdxpApplicationException(ErrorCode.FILE_NOT_ATTACHED);
        Map<String, OrderDocParseResponse> response = orderDocBusiness.parse(principal.getUser().getId(), file);

        String fileName = null;
        for (String key : response.keySet()) fileName = key;

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header("Content-Disposition", "attachment; filename=" + fileName)
                .body(response.get(fileName));
    }

    @CrossOrigin
    @PostMapping("/analysis")
    public CommonResponse<OrderDocRiskResponse> requestAnalysis(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocRiskRequest request
    ) throws IOException {
        return CommonResponse.success(orderDocBusiness.analysis(principal.getUser().getId(), request));
    }

    @CrossOrigin
    @DeleteMapping("/parser-delete")
    public CommonResponse<Void> deleteFile(
            @AuthenticationPrincipal PrincipalDetails principal
    ) throws IOException {
        orderDocBusiness.deleteResult(principal.getUser().getId());

        return CommonResponse.success();
    }
}

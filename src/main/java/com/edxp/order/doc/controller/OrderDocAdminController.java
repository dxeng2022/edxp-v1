package com.edxp.order.doc.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp.order.doc.business.OrderDocAdminBusiness;
import com.edxp.order.doc.dto.response.OrderDocCountResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "3-2. [문서 분석 모듈 - 관리자]", description = "관리자의 문서 분석 모듈 관련 기능입니다.")
@RequiredArgsConstructor
@RequestMapping("/admin/v1/doc")
@RestController
public class OrderDocAdminController {
    private final OrderDocAdminBusiness orderDocAdminBusiness;

    @Operation(summary = "사용자 문서 파싱 횟수", description = "해당 사용자의 문서 파싱을 진행한 횟수를 조회합니다.")
    @GetMapping("/{userId}/parse-count")
    public CommonResponse<OrderDocCountResponse> getParsingCount(
            @PathVariable Long userId
    ) {
        final OrderDocCountResponse response = orderDocAdminBusiness.getUserParsingCount(userId);

        return CommonResponse.success(response);
    }

    @Operation(summary = "사용자 문서 분석 횟수", description = "해당 사용자의 문서 분석을 진행한 횟수를 조회합니다.")
    @GetMapping("/{userId}/analysis-count")
    public CommonResponse<OrderDocCountResponse> getExtractCount(
            @PathVariable Long userId
    ) {
        final OrderDocCountResponse response = orderDocAdminBusiness.getUserExtractCount(userId);

        return CommonResponse.success(response);
    }
}

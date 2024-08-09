package com.edxp.s3file.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp.s3file.business.FileAdminBusiness;
import com.edxp.s3file.dto.response.FileVolumeResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "2-2. [관리자 - 데이터 관리]", description = "관리자의 사용자 클라우드 데이터를 관리하는 기능입니다.")
@RequiredArgsConstructor
@RequestMapping("/admin/v1/file")
@RestController
public class FileAdminController {
    private final FileAdminBusiness fileAdminBusiness;

    @Operation(summary = "사용자 폴더 용량 조회", description = "해당 사용자의 요청 경로 용량을 조회합니다.")
    @GetMapping("/{userId}/volume")
    public CommonResponse<FileVolumeResponse> getVolume(
            @PathVariable Long userId,
            @RequestParam String currentPath
    ) {
        FileVolumeResponse response = fileAdminBusiness.getUserVolume(userId, currentPath);

        return CommonResponse.success(response);
    }
}

package com.edxp.order.doccross.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp.order.doccross.business.OrderDocCrossBusiness;
import com.edxp.order.doccross.dto.OrderDocCrossRequest;
import com.edxp.order.doccross.dto.OrderDocCrossResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/doc-cross")
@RestController
public class OrderDocCrossController {
    private final OrderDocCrossBusiness orderDocCrossBusiness;

    @CrossOrigin
    @PostMapping("/valid")
    public CommonResponse<OrderDocCrossResponse> getData(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestBody OrderDocCrossRequest request
    ) {
        final OrderDocCrossResponse crossValidationData = orderDocCrossBusiness.getCrossValidationCloud(principal.getUser().getId(), request);

        return CommonResponse.success(crossValidationData);
    }

    @CrossOrigin
    @PostMapping("/valid-loc")
    public CommonResponse<OrderDocCrossResponse> getDataLocal(
            @AuthenticationPrincipal PrincipalDetails principal,
            @RequestParam("file") MultipartFile file
    ) {
        final OrderDocCrossResponse crossValidationData = orderDocCrossBusiness.getCrossValidationLocal(principal.getUser().getId(), file);

        return CommonResponse.success(crossValidationData);
    }
}

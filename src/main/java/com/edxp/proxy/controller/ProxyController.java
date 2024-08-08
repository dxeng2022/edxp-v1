package com.edxp.proxy.controller;

import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp.proxy.business.ProxyBusiness;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;

@RequestMapping("/proxy")
@RequiredArgsConstructor
@Controller
public class ProxyController {
    private final ProxyBusiness proxyBusiness;

    @GetMapping("/draw-image")
    public void proxyImage(
            @RequestParam(name = "imageKey") String imageKey,
            HttpServletResponse response
    ) {
        String imageUrl = proxyBusiness.getDrawImageUrl(imageKey);

        // 이미지 URL 캐싱된 경우, 캐시된 URL 사용
        proxyBusiness.responseImage(response, imageUrl);
    }

    @GetMapping("/sheet-image")
    public void proxySheetImage(
            @RequestParam(name = "imageKey") String imageKey,
            @AuthenticationPrincipal PrincipalDetails principal,
            HttpServletResponse response
    ) {
        String imageUrl = proxyBusiness.getSheetImageUrl(principal.getUser(), imageKey);

        // 이미지 URL 캐싱된 경우, 캐시된 URL 사용
        proxyBusiness.responseImage(response, imageUrl);
    }

    @GetMapping("/sheet-data")
    public ResponseEntity<String> proxySheetData(
            @RequestParam(name = "jsonKey") String jsonKey,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        String jsonUrl = proxyBusiness.getSheetDataUrl(principal.getUser(), jsonKey);
        String jsonData = proxyBusiness.getJsonData(jsonUrl);
        HttpHeaders headers = proxyBusiness.getHttpHeaders();

        return new ResponseEntity<>(jsonData, headers, HttpStatus.OK);
    }
}

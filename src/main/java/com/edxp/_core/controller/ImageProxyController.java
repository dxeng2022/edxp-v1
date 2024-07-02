package com.edxp._core.controller;

import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@RequestMapping("/proxy-image")
@Controller
public class ImageProxyController {
    @Value("${aws.s3.url}")
    private String AWS_S3_URL;

    @GetMapping
    public void proxyImage(
            @RequestParam(name = "imageKey") String imageKey,
            HttpServletResponse response
    ) {
        // 이미지 URL 캐싱된 경우, 캐시된 URL 사용
        String imageUrl = AWS_S3_URL.concat(imageKey);
        response.setHeader("Cache-Control", "max-age=60");
        response.setHeader("ETag", "dxeng-unique-tag");
        response.setContentType("image/png");

        try (InputStream inputStream = new URL(imageUrl).openStream()) {
            StreamUtils.copy(inputStream, response.getOutputStream());
        } catch (IOException e) {
            handleImageFetchError(response);
        }
    }

    @GetMapping("/v2")
    public ResponseEntity<String> proxyData(@RequestParam(name = "jsonKey") String jsonKey) {
        String jsonUrl = AWS_S3_URL.concat(jsonKey);

        try {
            // S3 URL 에서 JSON 데이터를 문자열로 읽어들임
            String jsonData = IOUtils.toString(new URL(jsonUrl), StandardCharsets.UTF_8);

            // 응답 헤더 설정
            HttpHeaders headers = new HttpHeaders();
//            headers.setCacheControl("max-age=60");
//            headers.setETag("dxeng-unique-tag");
            headers.setContentType(MediaType.APPLICATION_JSON);

            // JSON 데이터를 응답으로 반환
            return new ResponseEntity<>(jsonData, headers, HttpStatus.OK);
        } catch (IOException e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    private void handleImageFetchError(HttpServletResponse response) {
        try (InputStream errorImageStream = getClass().getResourceAsStream("/img/errorImage.png")) {
            if (errorImageStream != null) {
                StreamUtils.copy(errorImageStream, response.getOutputStream());
            } else {
                response.getOutputStream().write(new byte[0]);
            }
        } catch (IOException ignored) {
        }
    }
}

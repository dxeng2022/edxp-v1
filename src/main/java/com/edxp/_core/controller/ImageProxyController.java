package com.edxp._core.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

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

    private void handleImageFetchError(HttpServletResponse response) {
        try (InputStream errorImageStream = getClass().getResourceAsStream("/img/errorImage.png")) {
            if (errorImageStream != null) {
                StreamUtils.copy(errorImageStream, response.getOutputStream());
            } else {
                response.getOutputStream().write(new byte[0]);
            }
        } catch (IOException ignored) { }
    }
}

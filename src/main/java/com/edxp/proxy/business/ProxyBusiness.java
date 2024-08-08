package com.edxp.proxy.business;

import com.edxp._core.common.annotation.Business;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.user.dto.User;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.StreamUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.Set;

import static com.edxp._core.constant.Numbers.MINUTE;

@Slf4j
@Business
public class ProxyBusiness {
    @Value("${aws.s3.url}")
    private String AWS_S3_URL;

    @Value("${file.location}")
    private String location;

    private static final int CACHE_MAX_AGE = 5 * MINUTE; // 5 분

    // 헤더 설정
    public HttpHeaders getHttpHeaders() {
        // 응답 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setCacheControl("max-age=" + CACHE_MAX_AGE);
        headers.setETag("\"dxeng-unique-data\"");
        headers.setContentType(MediaType.APPLICATION_JSON);

        return headers;
    }

    public String setBasePath(Long userId) {
        return "dxeng/" + location + "/" + "user_" + String.format("%06d", userId) + "/" + "sheet/";
    }

    // Draw image proxy
    public String getDrawImageUrl(String imageKey) {
        imagePathValidation(imageKey);
        imageExtensionValidation(imageKey);

        return AWS_S3_URL.concat(imageKey);
    }

    // Sheet image proxy
    public String getSheetImageUrl(User user, String imageKey) {
        imageExtensionValidation(imageKey);

        String basePath = setBasePath(user.getId());

        return AWS_S3_URL.concat(basePath).concat(imageKey);
    }

    // Sheet image proxy
    public String getSheetDataUrl(User user, String jsonKey) {
        jsonExtensionValidation(jsonKey);

        String basePath = setBasePath(user.getId());

        return  AWS_S3_URL.concat(basePath).concat(jsonKey);
    }

    // Sheet data proxy
    public String getJsonData(String jsonUrl) {
        try {
            // S3 URL 에서 JSON 데이터를 문자열로 읽어들임
            return IOUtils.toString(new URL(jsonUrl), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    public void responseImage(HttpServletResponse response, String imageUrl) {
        response.setHeader("Cache-Control", "max-age=" + CACHE_MAX_AGE);
        response.setHeader("ETag", "dxeng-unique-image");
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
        } catch (IOException ignored) {
        }
    }

    /**
     *  == Validations ==
     */
    // 이미지 경로 validation
    private void imagePathValidation(String path) {
        final String rootPath = path.substring(0, path.indexOf("/"));

        if (!rootPath.equals("drawimg")) {
            throw new EdxpApplicationException(ErrorCode.INVALID_PATH);
        }
    }

    private void imageExtensionValidation(String imageKey) {
        String extension = imageKey.substring(imageKey.lastIndexOf(".") + 1);

        if (!Set.of("jpg", "png").contains(extension)) {
            throw new EdxpApplicationException(ErrorCode.INVALID_EXTENSION, "You can use image only");
        }
    }

    private void jsonExtensionValidation(String jsonKey) {
        String extension = jsonKey.substring(jsonKey.lastIndexOf(".") + 1);

        if (!Objects.equals("json", extension)) {
            throw new EdxpApplicationException(ErrorCode.INVALID_EXTENSION, "You can use json only");
        }
    }
}

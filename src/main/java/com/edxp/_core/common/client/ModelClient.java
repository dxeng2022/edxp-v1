package com.edxp._core.common.client;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

public class ModelClient {
    public static ResponseEntity<String> executeModelClient(String requestUrl, MultiValueMap<String, Object> requestMap) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(requestMap, headers);

        return restTemplate.postForEntity(requestUrl, requestEntity, String.class);
    }

    public static ResponseEntity<String> executeModelClient(String requestUrl, MultiValueMap<String, Object> requestMap, int timeout) {
        RestTemplate restTemplate = createRestTemplateWithTimeout(timeout);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(requestMap, headers);

        return restTemplate.postForEntity(requestUrl, requestEntity, String.class);
    }

    private static RestTemplate createRestTemplateWithTimeout(int timeout) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(timeout);
        factory.setReadTimeout(timeout);

        return new RestTemplate(factory);
    }
}

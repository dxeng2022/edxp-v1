package com.edxp.service;

import com.edxp._core.common.utils.FileUtil;
import com.edxp._core.constant.ErrorCode;
import com.edxp.domain.ParsedDocument;
import com.edxp.dto.request.FileUploadRequest;
import com.edxp.dto.request.RiskAnalyzeRequest;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class RiskExtractService {
    private final FileService fileService;

    @Value("${module.parser}")
    private String parserUrl;
    @Value("${module.analyze}")
    private String modelUrl;

    public Map<String, List<ParsedDocument>> parse(Long userId, MultipartFile file) throws IOException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        Resource fileResource;
        try {
            fileResource = convertMultipartFileToResource(file);
        } catch (IOException e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Converting failed");
        }

        MultiValueMap<String, Object> requestMap = new LinkedMultiValueMap<>();
        requestMap.add("file", fileResource);
        requestMap.add("userId", userId);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(requestMap, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(parserUrl, requestEntity, String.class);


        String resultName = RandomStringUtils.randomAlphanumeric(6);
        File resultFile = new File(resultName + "-parsed.json");
        File downsizedFile = new File(resultName + "-downsized.json");

        log.debug("resultFile: {}", resultFile);
        log.debug("downsizedFile: {}", downsizedFile);

        List<ParsedDocument> copiedDocuments;
        try (
                FileOutputStream fos1 = new FileOutputStream(resultFile);
                FileOutputStream fos2 = new FileOutputStream(downsizedFile)
        ) {
            ObjectMapper objectMapper = new ObjectMapper();
            TypeReference<List<ParsedDocument>> typeReference = new TypeReference<>() {
            };
            List<ParsedDocument> parsedDocuments = objectMapper.readValue(response.getBody(), typeReference);
            objectMapper.writeValue(fos1, parsedDocuments);

            for (ParsedDocument p : parsedDocuments) p.setWordList(null);

            objectMapper.writeValue(fos2, parsedDocuments);

            copiedDocuments = objectMapper.readValue(resultFile, typeReference);
        } catch (IOException e) {
            FileUtil.remove(resultFile);
            FileUtil.remove(downsizedFile);
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Mapping failed");
        }

        List<MultipartFile> files = new ArrayList<>();
        MultipartFile result;
        MultipartFile resultResized;
        try {
            result = convertFileToMultipartFile(resultFile);
            resultResized = convertFileToMultipartFile(downsizedFile);
        } catch (IOException e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Converting failed");
        } finally {
            FileUtil.remove(resultFile);
            FileUtil.remove(downsizedFile);
        }

        files.add(result);
        files.add(resultResized);
        FileUploadRequest uploadRequest = new FileUploadRequest("doc_risk/", files);

        fileService.uploadFile(userId, uploadRequest);

        Map<String, List<ParsedDocument>> responseMap = new HashMap<>();
        responseMap.put(result.getOriginalFilename(), copiedDocuments);

        if (response.getStatusCode().is2xxSuccessful())
            return responseMap;
        else
            return null;
    }

    public List<ParsedDocument> analysis(Long userId, RiskAnalyzeRequest request) throws IOException {
        File jsonFile = fileService.downloadAnalysisFile(userId, request.getFileName(), "doc_risk");

        try {
            MultiValueMap<String, Object> formData = new LinkedMultiValueMap<>();
            formData.add("file", new FileSystemResource(jsonFile));

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(formData, headers);

            ResponseEntity<String> responseEntity = restTemplate.postForEntity(modelUrl, requestEntity, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            List<ParsedDocument> analysisDocuments;
            analysisDocuments = objectMapper.readValue(responseEntity.getBody(), objectMapper.getTypeFactory().constructCollectionType(List.class, ParsedDocument.class));

            if (responseEntity.getStatusCode().is2xxSuccessful()) {
                return analysisDocuments;
            } else {
                throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Analysis is failed");
            }
        } catch (JsonProcessingException e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Mapping is failed");
        } finally {
            FileUtil.remove(jsonFile);
        }
    }

    public MultipartFile convertFileToMultipartFile(File file) throws IOException {
        FileItem fileItem = new DiskFileItem("file", Files.probeContentType(file.toPath()), false, file.getName(), (int) file.length(), file.getParentFile());

        InputStream fis = new FileInputStream(file);
        OutputStream fos = fileItem.getOutputStream();
        IOUtils.copy(fis, fos);

        fis.close();
        fos.close();

        return new CommonsMultipartFile(fileItem);
    }

    private Resource convertMultipartFileToResource(MultipartFile multipartFile) throws IOException {
        byte[] fileBytes = multipartFile.getBytes();

        return new ByteArrayResource(fileBytes) {
            @Override
            public String getFilename() {
                return multipartFile.getOriginalFilename(); // 파일 이름 설정
            }
        };
    }
}

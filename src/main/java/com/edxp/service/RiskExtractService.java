package com.edxp.service;

import com.edxp._core.common.utils.FileUtil;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.order.doc.domain.ParsedDocument;
import com.edxp.s3file.dto.requset.FileUploadRequest;
import com.edxp.dto.request.RiskAnalyzeRequest;
import com.edxp.dto.request.VisualizationDocRequest;
import com.edxp.dto.response.VisualizationDocParseResponse;
import com.edxp.dto.response.VisualizationDocRiskResponse;
import com.edxp.s3file.service.FileService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.edxp._core.common.client.ModelClient.executeModelClient;
import static com.edxp._core.common.converter.FileConverter.convertFileToMultipartFile;
import static com.edxp._core.common.converter.FileConverter.convertMultipartFileToResource;


@Slf4j
@RequiredArgsConstructor
@Service
public class RiskExtractService {
    private final FileService fileService;

    private final ObjectMapper objectMapper;
    private final TypeReference<List<ParsedDocument>> typeReference = new TypeReference<>() {
    };

    @Value("${module.parser}")
    private String parserUrl;
    @Value("${module.analyze}")
    private String modelUrl;
    @Value("${file.path}")
    private String downloadFolder;

    public Map<String, FileSystemResource> parseDown(Long userId, VisualizationDocRequest request) {
        File file = fileService.downloadAnalysisFile(userId, request.getFilePath(), "doc");
        String filePath = request.getFilePath();

        return Map.of(filePath, new FileSystemResource(file));
    }

    /**
     * [ 클라우드 파싱 실행 ]
     *
     * @param userId  log in user id
     * @param request file path
     * @return response map(filepath, response dto)
     * @throws IOException remove fail
     */
    public Map<String, VisualizationDocParseResponse> parseExecute(Long userId, VisualizationDocRequest request) throws IOException {
        StringBuilder userPath = getUserPath(userId);
        String folderPath = downloadFolder + "/" + userPath + "/" + request.getFilePath();
        File inputFile = new File(folderPath);

        return parse(userId, convertFileToMultipartFile(inputFile));
    }

    /**
     * [ ITB 파싱 ]
     *
     * @param userId user id log in
     * @param file   input file to request
     * @return parsed data
     * @throws IOException for file remove
     */
    public Map<String, VisualizationDocParseResponse> parse(Long userId, MultipartFile file) throws IOException {
        // 모델 실행
        MultiValueMap<String, Object> requestMap = new LinkedMultiValueMap<>();
        requestMap.add("file", convertMultipartFileToResource(file));
        requestMap.add("userId", userId);
        final ResponseEntity<String> response = executeModelClient(parserUrl, requestMap);

        // 1) 오브젝트 맵퍼로 객체로 받음
        List<ParsedDocument> documents = objectMapper.readValue(response.getBody(), typeReference);
        List<ParsedDocument> resizeDocs = copyDocumentsWithEmptyWordList(documents);

        // 2) 오브젝트 맵퍼로 파일에 씀
        String fileName = generateTempFileName() + "-parsed.json";
        File targetFile = new File(fileName);
        saveResultFile(objectMapper, documents, targetFile);

        String resizeFileName = generateTempFileName() + "-resize.json";
        File resizeTargetFile = new File(resizeFileName);
        saveResultFile(objectMapper, resizeDocs, resizeTargetFile);

        // 3) 쓴 파일을 멀티파트 파일로 바꾸고 삭제
        MultipartFile result = convertFileToMultipartFile(targetFile);
        MultipartFile resizeResult = convertFileToMultipartFile(resizeTargetFile);

        // 4) 업로드
        fileService.uploadFile(userId, new FileUploadRequest("doc_risk/", List.of(result)));
        fileService.uploadFile(userId, new FileUploadRequest("doc_risk/", List.of(resizeResult)));

        // 5) 객체 반환
        if (response.getStatusCode().is2xxSuccessful())
            return Map.of(Objects.requireNonNull(resizeResult.getOriginalFilename()), VisualizationDocParseResponse.from(resizeDocs));
        else
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Parser is failed");
    }

    /**
     * [ 독소조항 추출 ]
     *
     * @param userId  user id log in
     * @param request request file name
     * @return document
     */
    public VisualizationDocRiskResponse analysis(Long userId, RiskAnalyzeRequest request) throws IOException {
        File parsedFile = fileService.downloadAnalysisFile(userId, request.getFileName(), "doc_risk");

        // 모델 실행
        MultiValueMap<String, Object> requestMap = new LinkedMultiValueMap<>();
        requestMap.add("file", new FileSystemResource(parsedFile));
        requestMap.add("userId", userId);
        ResponseEntity<String> response = executeModelClient(modelUrl, requestMap);

        // 1) 오브젝트 맵퍼로 객체로 받음
        List<ParsedDocument> documents = objectMapper.readValue(response.getBody(), typeReference);

        // 2) 오브젝트 맵퍼로 파일에 씀
        String filename = getFilenameFromHeader(response);
        File targetFile = new File(filename);
        saveResultFile(objectMapper, documents, targetFile);

        // 3) 쓴 파일을 멀티파트 파일로 바꾸고 삭제
        MultipartFile result = convertFileToMultipartFile(targetFile);
        FileUtil.remove(parsedFile);

        // 4) 업로드
        fileService.uploadFile(userId, FileUploadRequest.of("doc_risk/", List.of(result)));

        // 5) 객체 반환
        if (response.getStatusCode().is2xxSuccessful()) {
            return VisualizationDocRiskResponse.from(documents);
        } else {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Analysis is failed");
        }
    }

    /**
     * [ 파일 삭제 ]
     *
     * @param userId login user id
     * @throws IOException remove fail
     */
    public void deleteResult(Long userId) throws IOException {
        StringBuilder userPath = getUserPath(userId);
        String folderPath = downloadFolder + "/" + userPath;
        FileUtil.remove(new File(folderPath));
    }

    private StringBuilder getUserPath(Long userId) {
        StringBuilder userPath = new StringBuilder();
        userPath.append("user_").append(String.format("%06d", userId)).append("/").append("doc");
        return userPath;
    }

    public List<ParsedDocument> copyDocumentsWithEmptyWordList(List<ParsedDocument> originalDocuments) {
        return originalDocuments.stream()
                .map(document -> ParsedDocument.builder()
                        .index(document.getIndex())
                        .label(document.getLabel())
                        .page(document.getPage())
                        .section(document.getSection())
                        .sentence(document.getSentence())
                        .wordList(List.of())
                        .build())
                .collect(Collectors.toList());
    }

    private void saveResultFile(ObjectMapper objectMapper, List<ParsedDocument> documents, File targetFile) throws IOException {
        try (FileOutputStream fos1 = new FileOutputStream(targetFile)) {
            objectMapper.writeValue(fos1, documents);
        } catch (IOException e) {
            FileUtil.remove(targetFile);
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Mapping failed");
        }
    }

    private String generateTempFileName() {
        // 임시 파일 이름 생성 (UUID 사용)
        return UUID.randomUUID().toString();
    }

    private String getFilenameFromHeader(ResponseEntity<String> response) {
        String contentDispositionHeader = response.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION);
        ContentDisposition contentDisposition = ContentDisposition.parse(Objects.requireNonNull(contentDispositionHeader));
        return contentDisposition.getFilename();
    }
}

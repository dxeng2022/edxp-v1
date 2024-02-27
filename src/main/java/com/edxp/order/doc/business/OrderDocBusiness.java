package com.edxp.order.doc.business;

import com.edxp._core.common.annotation.Business;
import com.edxp._core.common.utils.FileUtil;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.order.doc.converter.OrderDocConverter;
import com.edxp.order.doc.dto.request.OrderDocParseRequest;
import com.edxp.order.doc.dto.request.OrderDocParseUpdateRequest;
import com.edxp.order.doc.dto.request.OrderDocRequest;
import com.edxp.order.doc.dto.request.OrderDocRiskRequest;
import com.edxp.order.doc.dto.response.OrderDocParseResponse;
import com.edxp.order.doc.dto.response.OrderDocRiskResponse;
import com.edxp.order.doc.entity.OrderDocEntity;
import com.edxp.order.doc.model.ParsedDocument;
import com.edxp.order.doc.service.OrderDocService;
import com.edxp.s3file.dto.requset.FileUploadRequest;
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
@Business
public class OrderDocBusiness {
    private final OrderDocConverter orderDocConverter;
    private final OrderDocService orderDocService;
    private final FileService fileService;

    private final ObjectMapper objectMapper;
    private final TypeReference<List<ParsedDocument>> typeReference = new TypeReference<>() {};

    @Value("${module.parser}")
    private String parserUrl;
    @Value("${module.analyze}")
    private String modelUrl;
    @Value("${file.path}")
    private String downloadFolder;

    /**
     * [ 미리보기용 pdf 다윤요청 ]
     *
     * @param userId  log in user id
     * @param request file path
     * @return response map(filepath, pdf file)
     */
    public Map<String, FileSystemResource> parseDown(Long userId, OrderDocParseRequest request) {
        File file = fileService.downloadAnalysisFile(userId, request.getFilePath(), "doc");
        String filePath = request.getFilePath();

        return Map.of(filePath, new FileSystemResource(file));
    }

    /**
     * [ 클라우드 파싱 요청 ]
     *
     * @param userId  log in user id
     * @param request file path
     * @return response map(filepath, response dto)
     * @throws IOException remove fail
     */
    public Map<String, OrderDocParseResponse> parseExecute(Long userId, OrderDocParseRequest request) throws IOException {
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
     * @apiNote ITB 문서 파싱을 진행하는 API
     * @since 2024.02.27
     */
    public Map<String, OrderDocParseResponse> parse(Long userId, MultipartFile file) throws IOException {
        // 모델 실행
        MultiValueMap<String, Object> requestMap = new LinkedMultiValueMap<>();
        requestMap.add("file", convertMultipartFileToResource(file));
        requestMap.add("userId", userId);
//        final ResponseEntity<String> response = executeModelClient(parserUrl, requestMap);
        final ResponseEntity<String> response = executeModelClient(parserUrl, requestMap);

        // 1) 오브젝트 맵퍼로 객체로 받음
        List<ParsedDocument> documents = objectMapper.readValue(response.getBody(), typeReference);
//        List<ParsedDocument> resizeDocs = copyDocumentsWithEmptyWordList(documents);

        // 2) 오브젝트 맵퍼로 파일에 씀
        String generatedName = getFilenameFromHeader(response);
//        String fileName = generatedName + "-parsed.json";
//        File targetFile = new File(fileName);
//        saveResultFile(objectMapper, documents, targetFile);

        String resizeFileName = generatedName + "-resize.json";
        File resizeTargetFile = new File(resizeFileName);
        saveResultFile(objectMapper, documents, resizeTargetFile);

        // 3) 쓴 파일을 멀티파트 파일로 바꾸고 삭제
//        MultipartFile result = convertFileToMultipartFile(targetFile);
        MultipartFile resizeResult = convertFileToMultipartFile(resizeTargetFile);

        // 4) S3 업로드
//        fileService.uploadFile(userId, FileUploadRequest.of("doc_risk/", List.of(result)));
        fileService.uploadFile(userId, FileUploadRequest.of("doc_risk/", List.of(resizeResult)));

        // 5) 주문 등록
        final OrderDocEntity orderDocEntity = orderDocConverter.toEntity(OrderDocRequest.of(
                file.getOriginalFilename(),
                file.getSize(),
                generatedName,
                resizeResult.getSize())
        );
        orderDocService.order(userId, orderDocEntity);

        // 6) 객체 반환
        if (response.getStatusCode().is2xxSuccessful())
            return Map.of(Objects.requireNonNull(resizeResult.getOriginalFilename()), OrderDocParseResponse.from(documents));
        else
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Parser is failed");
    }

    /**
     * [ 파싱문서 수정 ]
     *
     * @param userId user id log in
     * @param request request file name and updated documents
     * @return parsed data
     * @throws IOException for file remove
     */
    public Map<String, OrderDocParseResponse> parseUpdate(Long userId, OrderDocParseUpdateRequest request) throws IOException {
        File targetFile = new File(request.getFileName());

        // 1) 오브젝트 맵퍼로 파일에 씀
        saveResultFile(objectMapper, request.getDocuments(), targetFile);

        // 2) 쓴 파일을 멀티파트 파일로 바꾸고 삭제
        MultipartFile updatedResult = convertFileToMultipartFile(targetFile);

        // 3) 기존 업로드된 파일 삭제
        fileService.deleteAnalysisFile(userId, request.getFileName(), "doc_risk");

        // 4) S3 업로드
        fileService.uploadFile(userId, FileUploadRequest.of("doc_risk/", List.of(updatedResult)));

        return Map.of(request.getFileName(), OrderDocParseResponse.from(request.getDocuments()));
    }

    /**
     * [ 독소조항 추출 ]
     *
     * @param userId  user id log in
     * @param request request file name
     * @return document
     */
    public OrderDocRiskResponse analysis(Long userId, OrderDocRiskRequest request) throws IOException {
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

        // 4) S3 업로드
        fileService.uploadFile(userId, FileUploadRequest.of("doc_risk/", List.of(result)));

        // 5) 독소조항 추출 등록
        orderDocService.riskExtract(userId, filename.substring(0, filename.lastIndexOf("-")));

        // 5) 파싱 파일 삭제
        fileService.deleteAnalysisFile(userId, request.getFileName(), "doc_risk");

        // 6) 객체 반환
        if (response.getStatusCode().is2xxSuccessful()) {
            return OrderDocRiskResponse.from(documents);
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

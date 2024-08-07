package com.edxp.order.doc.business;

import com.edxp._core.common.annotation.Business;
import com.edxp._core.common.utils.FileUtil;
import com.edxp._core.common.utils.SortUtil;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.order.doc.converter.OrderDocConverter;
import com.edxp.order.doc.dto.request.*;
import com.edxp.order.doc.dto.response.OrderDocParseResponse;
import com.edxp.order.doc.dto.response.OrderDocResponse;
import com.edxp.order.doc.dto.response.OrderDocRiskResponse;
import com.edxp.order.doc.dto.response.OrderDocVisualListResponse;
import com.edxp.order.doc.model.ParsedDocument;
import com.edxp.order.doc.service.OrderDocService;
import com.edxp.s3file.dto.requset.FileUploadRequest;
import com.edxp.s3file.dto.response.FileListResponse;
import com.edxp.s3file.service.FileService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
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
     * [ 주문 내용 조회 ]
     *
     * @param userId log in user id
     * @param pageable page interface
     * @return page paged response
     * @apiNote 독소조항 주문 내용 조회 API
     * @since 24.02.28
     */
    public Page<OrderDocResponse> getOrderListWithPage(Long userId, Pageable pageable) {
        return orderDocConverter.entityToResponseWitPage(orderDocService.getOrderListWithPage(userId, pageable));
    }

    /**
     * [ 미리보기용 pdf 다윤요청 ]
     *
     * @param userId  log in user id
     * @param request file path
     * @return response map(filepath, pdf file)
     * @since 24.02.28
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
     * @since 24.02.28
     */
    public OrderDocParseResponse parseExecute(Long userId, OrderDocParseRequest request) throws IOException {
        StringBuilder userPath = getUserPath(userId);
        String folderPath = downloadFolder + "/" + userPath + "/" + request.getFilePath();
        final int pathIndex = request.getFilePath().lastIndexOf("/");
        String originalFilePath = "";
        if (pathIndex > -1) originalFilePath = request.getFilePath().substring(0, pathIndex);
        File inputFile = new File(folderPath);

        return parse(userId, originalFilePath, convertFileToMultipartFile(inputFile));
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
    public OrderDocParseResponse parse(Long userId, String originalFilePath, MultipartFile file) throws IOException {
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

        final OrderDocRequest orderDocRequest = OrderDocRequest.of(
                file.getOriginalFilename(),
                originalFilePath,
                file.getSize(),
                generatedName,
                resizeResult.getSize());

        // 5) 주문 등록
        orderDocService.order(userId, orderDocRequest);

        // 6) 객체 반환
        if (response.getStatusCode().is2xxSuccessful())
            return OrderDocParseResponse.from(resizeResult.getOriginalFilename(), documents);
        else
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Parser is failed");
    }

    /**
     * [ 문서 수정 ]
     *
     * @param userId user id log in
     * @param request request file name and updated documents
     * @return parsed data
     * @throws IOException for file remove
     * @since 24.02.28
     */
    public Object documentUpdate(Long userId, OrderDocParseUpdateRequest request) throws IOException {
        File targetFile = new File(request.getFileName());

        // 1) 오브젝트 맵퍼로 파일에 씀
        saveResultFile(objectMapper, request.getDocuments(), targetFile);

        // 2) 쓴 파일을 멀티파트 파일로 바꾸고 삭제
        MultipartFile updatedResult = convertFileToMultipartFile(targetFile);

        // 3) 기존 업로드된 파일 삭제
        fileService.deleteAnalysisFile(userId, request.getFileName(), request.getFileLocation());

        // 4) S3 업로드
        fileService.uploadFile(userId, FileUploadRequest.of(request.getFileLocation() + "/", List.of(updatedResult)));

        if (request.getFileName().substring(request.getFileName().lastIndexOf("-") + 1).equals("resize.json"))
            return OrderDocParseResponse.from(request.getFileName(), request.getDocuments());
        else
            return OrderDocRiskResponse.from(request.getFileName(), request.getDocuments());
    }

    /**
     * [ 분석 이벤트 처리 ]
     *
     * @param userId user id sign in
     * @param filename filename to analysis
     * @return SseEmitter
     */
    public SseEmitter analysisEmitter(Long userId, String filename) {
        Duration waitTime = Duration.ofHours(1);
        SseEmitter emitter = new SseEmitter(waitTime.toMillis());

        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

        Runnable waitTask = () -> {
            try {
                emitter.send(SseEmitter.event().name("event-wait").data("please wait"));
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        };

        scheduler.scheduleAtFixedRate(waitTask, 0, 50, TimeUnit.SECONDS);

        new Thread(() -> {
            try {
                OrderDocRiskRequest request = new OrderDocRiskRequest();
                request.setFileName(filename);
                emitter.send(SseEmitter.event().name("event-result").data(analysis(userId, request)));
                emitter.complete();
            } catch (Exception e) {
                emitter.completeWithError(e);
            } finally {
                scheduler.shutdown();
            }
        }).start();

        return emitter;
    }

    /**
     * [ 독소조항 추출 ]
     *
     * @param userId  user id log in
     * @param request request file name
     * @return document
     * @since 24.02.28
     */
    public OrderDocRiskResponse analysis(Long userId, OrderDocRiskRequest request) throws IOException {
        File parsedFile = fileService.downloadAnalysisFile(userId, request.getFileName(), "doc_risk");

        // 모델 실행
        MultiValueMap<String, Object> requestMap = new LinkedMultiValueMap<>();
        requestMap.add("file", new FileSystemResource(parsedFile));
        requestMap.add("userId", userId);
        ResponseEntity<String> response = executeModelClient(modelUrl, requestMap, (int) TimeUnit.HOURS.toMillis(1));

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
            return OrderDocRiskResponse.from(filename, documents);
        } else {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Analysis is failed");
        }
    }

    /**
     * [ 시각화 파일리스트 ]
     *
     * @param userId user id log in
     * @return file list to visualization
     * @since 24.04.25
     */
    public List<OrderDocVisualListResponse> visualList(Long userId) {
        final List<OrderDocResponse> orders = orderDocService.getOrderList(userId).stream()
                .map(orderDocConverter::toResponse)
                .collect(Collectors.toList());
        final List<FileListResponse> resultFiles = fileService.getFiles(userId, "doc_risk/").stream()
                .filter(file -> file.getFileName().endsWith("-result.json"))
                .collect(Collectors.toList());

        List<OrderDocVisualListResponse> mergedList = new ArrayList<>();

        for (FileListResponse resultFile : resultFiles) {
            for (OrderDocResponse order : orders) {
                final String orderKey = resultFile.getFileName().replace("-result.json", "");

                if (order.getOrderFileName().equals(orderKey)) {
                    mergedList.add(OrderDocVisualListResponse.from(resultFile, order));
                    break;
                }
            }
        }

        SortUtil.sortByExtractedDate(mergedList);

        return mergedList ;
    }

    /**
     * [ 시각화용 pdf 요청 ]
     *
     * @param userId user id signed in
     * @param request visual file name
     * @return pdf file
     * @since 24.05.09
     */
    public Map<String, FileSystemResource> visualDown(Long userId, OrderDocVisualRequest request) {
        String orderKey = request.getFileName().substring(0, request.getFileName().lastIndexOf("-"));
        final OrderDocResponse order = orderDocService.getOrder(userId, orderKey);

        String pdfPath = "";
        if (!order.getOriginalFilePath().equals("")) pdfPath = order.getOriginalFilePath().concat("/");
        pdfPath = pdfPath.concat(order.getOriginalFileName());
        File file = fileService.downloadAnalysisFile(userId, pdfPath, "doc");

        return Map.of(pdfPath, new FileSystemResource(file));
    }

    /**
     * [ 시각화 요청 ]
     *
     * @param userId  user id log in
     * @param request request file name
     * @return document
     * @since 24.03.26
     */
    public OrderDocRiskResponse visualization(Long userId, OrderDocRiskRequest request) throws IOException {
        File parsedFile = fileService.downloadAnalysisFile(userId, request.getFileName(), request.getFileLocation());
        List<ParsedDocument> documents = objectMapper.readValue(parsedFile, typeReference);
        FileUtil.remove(parsedFile);

        return OrderDocRiskResponse.from(request.getFileName(), documents);
    }

    /**
     * [ 로컬 시각화 요청 ]
     *
     * @param file visual json file
     * @return local visual response
     * @throws IOException mapper error
     * @since 24-05-09
     */
    public OrderDocRiskResponse visualizationLocal(MultipartFile file) throws IOException {
        List<ParsedDocument> documents = objectMapper.readValue(file.getInputStream(), typeReference);

        return OrderDocRiskResponse.from(file.getOriginalFilename(), documents);
    }

    /**
     * [ 임시파일 저장 ]
     *
     * @param userId user id signed in
     * @param request saveFileName, fileName
     * @since 24-05-10
     */
    public void saveResult(Long userId, OrderDocVisualSaveRequest request) {
        fileService.moveFile(userId, request.getSaveFileName(), request.getFileName());
    }

    /**
     * [ 파일 삭제 ]
     *
     * @param userId login user id
     * @throws IOException remove fail
     * @since 24.02.28
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

    private void saveResultFile(ObjectMapper objectMapper, List<ParsedDocument> documents, File targetFile) throws IOException {
        try (FileOutputStream fos1 = new FileOutputStream(targetFile)) {
            objectMapper.writeValue(fos1, documents);
        } catch (IOException e) {
            FileUtil.remove(targetFile);
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Mapping failed");
        }
    }

    private String getFilenameFromHeader(ResponseEntity<String> response) {
        String contentDispositionHeader = response.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION);
        ContentDisposition contentDisposition = ContentDisposition.parse(Objects.requireNonNull(contentDispositionHeader));
        return contentDisposition.getFilename();
    }
}

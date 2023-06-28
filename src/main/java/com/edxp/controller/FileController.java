package com.edxp.controller;

import com.amazonaws.services.s3.AmazonS3Client;
import com.edxp.common.response.CommonResponse;
import com.edxp.config.auth.PrincipalDetails;
import com.edxp.constant.ErrorCode;
import com.edxp.dto.request.FileDeleteRequest;
import com.edxp.dto.request.FileUploadRequest;
import com.edxp.dto.response.FileListResponse;
import com.edxp.exception.EdxpApplicationException;
import com.edxp.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/file")
@RestController
public class FileController {
    private final AmazonS3Client amazonS3Client;
    private final FileService fileService;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

//    @GetMapping
//    public CommonResponse<List<?>> getFileList(
//            @RequestParam(required = false) String currentPath,
//            @AuthenticationPrincipal PrincipalDetails principal
//    ) {
//        if(principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
//        List<?> files = fileService.getFiles(principal.getUser().getId(), currentPath);
//        return CommonResponse.success(files);
//    }

    @GetMapping
    public CommonResponse<List<FileListResponse>> getFileList(
            @RequestParam(required = false) String currentPath,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if(principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        List<FileListResponse> files = fileService.getFiles(principal.getUser().getId(), currentPath);
        return CommonResponse.success(files);
    }


    @GetMapping("/image/{filename}")
    public ResponseEntity<?> downloadFile(@PathVariable String filename) {
        log.info("filename: {}", filename);
//        InputStreamResource resource = imageService.downloadImage(filename);
//        return ResponseEntity.ok()
//                .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
//                .body(resource);
        return ResponseEntity.ok().build();
    }

    @CrossOrigin
    @PostMapping
    public CommonResponse<Void> uploadFile(
            @RequestPart(value = "data")  FileUploadRequest request,
            @RequestPart(value = "file") MultipartFile file,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if(principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        if(file == null) throw new EdxpApplicationException(ErrorCode.FILE_NOT_ATTACHED);
        fileService.uploadFile(principal.getUser().getId(), new FileUploadRequest(request.getCurrentPath(), file));
        return CommonResponse.success();
    }

    @CrossOrigin
    @DeleteMapping
    public CommonResponse<Void> deleteFile(@RequestBody FileDeleteRequest request) {
        fileService.deleteFile(request);
        return CommonResponse.success();
    }
}

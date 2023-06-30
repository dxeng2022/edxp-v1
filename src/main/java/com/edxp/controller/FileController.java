package com.edxp.controller;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import com.edxp.common.response.CommonResponse;
import com.edxp.config.auth.PrincipalDetails;
import com.edxp.constant.ErrorCode;
import com.edxp.dto.request.FileDeleteRequest;
import com.edxp.dto.request.FileDownloadRequest;
import com.edxp.dto.request.FileFolderRequest;
import com.edxp.dto.request.FileUploadRequest;
import com.edxp.dto.response.FileListResponse;
import com.edxp.exception.EdxpApplicationException;
import com.edxp.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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

    @GetMapping
    public CommonResponse<List<FileListResponse>> getFileList(
            @RequestParam(required = false) String currentPath,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if (principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        List<FileListResponse> files = fileService.getFiles(principal.getUser().getId(), currentPath);
        return CommonResponse.success(files);
    }

    @CrossOrigin
    @PostMapping("/add-folder")
    public CommonResponse<Void> addFolder(
            @RequestBody FileFolderRequest request,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if (principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        fileService.addFolder(principal.getUser().getId(), request);
        return CommonResponse.success();
    }

    @CrossOrigin
    @PostMapping("/upload")
    public CommonResponse<Void> uploadFile(
            @RequestPart(value = "data") FileUploadRequest request,
            @RequestPart(value = "file") MultipartFile file,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if (principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        if (file == null) throw new EdxpApplicationException(ErrorCode.FILE_NOT_ATTACHED);
        fileService.uploadFile(principal.getUser().getId(), new FileUploadRequest(request.getCurrentPath(), file));
        return CommonResponse.success();
    }
    @CrossOrigin
    @PostMapping("/download")
    public ResponseEntity<?> downloadFile(@RequestBody FileDownloadRequest request) {
        InputStreamResource resource = fileService.downloadFile(request);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename="
                                + request.getFilePath().substring(request.getFilePath().lastIndexOf("/")))
                .body(resource);
    }

    @CrossOrigin
    @DeleteMapping
    public CommonResponse<Void> deleteFile(@RequestBody FileDeleteRequest request) {
        boolean isSuccess = fileService.deleteFile(request);
        if (!isSuccess) throw new EdxpApplicationException(ErrorCode.FILE_NOT_FOUND);
        return CommonResponse.success();
    }
}

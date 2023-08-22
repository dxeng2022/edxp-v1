package com.edxp.controller;

import com.edxp.common.response.CommonResponse;
import com.edxp.config.auth.PrincipalDetails;
import com.edxp.constant.ErrorCode;
import com.edxp.dto.request.*;
import com.edxp.dto.response.FileListResponse;
import com.edxp.dto.response.FileVolumeResponse;
import com.edxp.dto.response.FolderListResponse;
import com.edxp.exception.EdxpApplicationException;
import com.edxp.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/file")
@RestController
public class FileController {
    private final FileService fileService;

    // 파일 및 폴더리스트
    @GetMapping
    public CommonResponse<List<FileListResponse>> getFileList(
            @RequestParam(required = false) String currentPath,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if (principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        List<FileListResponse> files = fileService.getFiles(principal.getUser().getId(), currentPath);
        return CommonResponse.success(files);
    }

    // 폴더 리스트
    @GetMapping("/get-folder")
    public CommonResponse<List<FolderListResponse>> getFolder(
            @RequestParam(required = false) String currentPath,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if (principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        List<FolderListResponse> folders = fileService.getFolders(principal.getUser().getId(), currentPath);
        return CommonResponse.success(folders);
    }

    // 전체 용량 확인
    @GetMapping("/get-volume")
    public CommonResponse<FileVolumeResponse> getVolume(
            @RequestParam(required = false) String currentPath,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if (principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        FileVolumeResponse response = fileService.getVolume(principal.getUser().getId(), currentPath);
        return CommonResponse.success(response);
    }

    // 폴더 생성
    @CrossOrigin
    @PostMapping("/add-folder")
    public CommonResponse<Void> addFolder(
            @RequestBody FolderAddRequest request,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if (principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        fileService.addFolder(principal.getUser().getId(), request);
        return CommonResponse.success();
    }

    // 파일 업로드
    @CrossOrigin
    @PostMapping("/upload")
    public CommonResponse<Void> uploadFile(
            @RequestPart(value = "data") FileUploadRequest request,
            @RequestPart(value = "files") List<MultipartFile> files,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if (principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        if (files == null) throw new EdxpApplicationException(ErrorCode.FILE_NOT_ATTACHED);
        fileService.uploadFile(principal.getUser().getId(), new FileUploadRequest(request.getCurrentPath(), files));
        return CommonResponse.success();
    }

    // 파일 다운로드
    @CrossOrigin
    @PostMapping("/download")
    public void downloadFiles(
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse,
            @RequestBody FileDownloadsRequest request,
            @AuthenticationPrincipal PrincipalDetails principal
    ) throws IOException {
        log.debug("json: {}", request.toString());
        if (principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        httpResponse.setStatus(HttpServletResponse.SC_OK);
        fileService.downloadFiles(httpRequest, httpResponse, request, principal.getUser().getId());
    }

    // 파일 업데이트, 이름변경
    @CrossOrigin
    @PutMapping
    public CommonResponse<Void> updateFile(
            @RequestBody FileUpdateRequest request,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        fileService.updateFile(request, principal.getUser().getId());
        return CommonResponse.success();
    }

    // 파일 삭제
    @CrossOrigin
    @DeleteMapping
    public CommonResponse<Void> deleteFile(
            @RequestBody FileDeleteRequest request,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        boolean isSuccess = fileService.deleteFile(request, principal.getUser().getId());
        if (!isSuccess) throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "File delete is failed.");
        return CommonResponse.success();
    }
}

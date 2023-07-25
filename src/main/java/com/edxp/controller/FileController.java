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

    @GetMapping
    public CommonResponse<List<FileListResponse>> getFileList(
            @RequestParam(required = false) String currentPath,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if (principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        List<FileListResponse> files = fileService.getFiles(principal.getUser().getId(), currentPath);
        return CommonResponse.success(files);
    }

    @GetMapping("/get-folder")
    public CommonResponse<List<FolderListResponse>> getFolder(
            @RequestParam(required = false) String currentPath,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if (principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        List<FolderListResponse> folders = fileService.getFolders(principal.getUser().getId(), currentPath);
        return CommonResponse.success(folders);
    }

    @GetMapping("/get-volume")
    public CommonResponse<FileVolumeResponse> getVolume(
            @RequestParam(required = false) String currentPath,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if (principal == null) throw new EdxpApplicationException(ErrorCode.USER_NOT_LOGIN);
        FileVolumeResponse response = fileService.getVolume(principal.getUser().getId(), currentPath);
        return CommonResponse.success(response);
    }

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

    @CrossOrigin
    @PostMapping("/download")
    public void downloadFiles(
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse,
            @RequestBody FileDownloadsRequest request,
            @AuthenticationPrincipal PrincipalDetails principal
    ) throws IOException {
        httpResponse.setStatus(HttpServletResponse.SC_OK);
        fileService.downloadFiles(httpRequest, httpResponse, request, principal.getUser().getId());
    }

    @CrossOrigin
    @PutMapping
    public CommonResponse<Void> updateFile(
            @RequestBody FileUpdateRequest request,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        fileService.updateFile(request, principal.getUser().getId());
        return CommonResponse.success();
    }

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

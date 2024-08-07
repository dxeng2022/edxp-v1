package com.edxp.s3file.controller;

import com.edxp._core.common.response.CommonResponse;
import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.s3file.dto.requset.FileDeleteRequest;
import com.edxp.s3file.dto.requset.FileDownloadsRequest;
import com.edxp.s3file.dto.requset.FileFolderAddRequest;
import com.edxp.s3file.dto.requset.FileUpdateRequest;
import com.edxp.s3file.dto.requset.FileUploadRequest;
import com.edxp.s3file.dto.response.FileFolderListResponse;
import com.edxp.s3file.dto.response.FileListResponse;
import com.edxp.s3file.dto.response.FileVolumeResponse;
import com.edxp.s3file.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Tag(name = "3. [데이터 관리]", description = "클라우드 데이터 관리 기능입니다.")
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/file")
@RestController
public class FileController {
    private final FileService fileService;

    @Operation(summary = "파일리스트 조회", description = "요청 경로의 파일 리스트를 조회합니다.")
    @GetMapping
    public CommonResponse<List<FileListResponse>> getFileList(
            @RequestParam String currentPath,
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal
    ) {
        List<FileListResponse> files = fileService.getFiles(principal.getUser().getId(), currentPath);

        return CommonResponse.success(files);
    }

    @Operation(summary = "폴더리스트 조회", description = "요청 경로의 폴더 리스트를 조회합니다.")
    @GetMapping("/get-folder")
    public CommonResponse<List<FileFolderListResponse>> getFolder(
            @RequestParam(required = false) String currentPath,
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal
    ) {
        List<FileFolderListResponse> folders = fileService.getFolders(principal.getUser().getId(), currentPath);

        return CommonResponse.success(folders);
    }

    @Operation(summary = "폴더 용량 조회", description = "요청 경로의 용량을 조회합니다.")
    @GetMapping("/get-volume")
    public CommonResponse<FileVolumeResponse> getVolume(
            @RequestParam String currentPath,
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal
    ) {
        FileVolumeResponse response = fileService.getVolume(principal.getUser().getId(), currentPath);

        return CommonResponse.success(response);
    }

    @Operation(summary = "폴더 생성", description = "요청 경로에 폴더를 생성합니다.")
    @CrossOrigin
    @PostMapping("/add-folder")
    public CommonResponse<Void> addFolder(
            @RequestBody FileFolderAddRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal
    ) {
        fileService.addFolder(principal.getUser().getId(), request);

        return CommonResponse.success();
    }

    @Operation(summary = "파일 업로드", description = "요청 경로에 파일을 업로드합니다.")
    @CrossOrigin
    @PostMapping("/upload")
    public CommonResponse<Void> uploadFile(
            @RequestPart(value = "data") FileUploadRequest request,
            @RequestPart(value = "files") List<MultipartFile> files,
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if (files == null) throw new EdxpApplicationException(ErrorCode.FILE_NOT_ATTACHED);
        fileService.uploadFile(principal.getUser(), new FileUploadRequest(request.getCurrentPath(), files));

        return CommonResponse.success();
    }

    @Operation(summary = "파일 다운로드", description = "요청 경로에 파일을 다운로드합니다.")
    @CrossOrigin
    @PostMapping("/download")
    public void downloadFiles(
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse,
            @RequestBody FileDownloadsRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal
    ) {
        log.debug("json: {}", request.toString());
        httpResponse.setStatus(HttpServletResponse.SC_OK);
        fileService.downloadFiles(httpRequest, httpResponse, request, principal.getUser().getId());
    }

    @Operation(summary = "파일 이름 변경", description = "파일의 이름을 변경합니다.")
    @CrossOrigin
    @PutMapping
    public CommonResponse<Void> updateFile(
            @RequestBody FileUpdateRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal
    ) {
        fileService.updateFile(request, principal.getUser().getId());

        return CommonResponse.success();
    }

    @Operation(summary = "파일 삭제", description = "요청 경로의 파일을 삭제합니다.")
    @CrossOrigin
    @DeleteMapping
    public CommonResponse<Void> deleteFile(
            @RequestBody FileDeleteRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal PrincipalDetails principal
    ) {
        boolean isSuccess = fileService.deleteFile(request, principal.getUser().getId());
        if (!isSuccess) throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "File delete is failed");

        return CommonResponse.success();
    }
}

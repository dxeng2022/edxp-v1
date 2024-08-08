package com.edxp.s3file.business;

import com.edxp._core.common.annotation.Business;
import com.edxp.s3file.dto.response.FileVolumeResponse;
import com.edxp.s3file.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Business
public class FileAdminBusiness {
    private final FileService fileService;

    public FileVolumeResponse getUserVolume(Long userId, String currentPath) {

        return fileService.getVolume(userId, currentPath);
    }
}

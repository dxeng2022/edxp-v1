package com.edxp.s3file.business;

import com.edxp._core.common.annotation.Business;
import com.edxp.s3file.dto.response.FileVolumeResponse;
import com.edxp.s3file.service.FileService;
import com.edxp.user.dto.User;
import com.edxp.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Business
public class FileAdminBusiness {
    private final FileService fileService;
    private final UserService userService;

    public FileVolumeResponse getUserVolume(Long userId, String currentPath) {
        final User user = userService.getUser(userId);

        return fileService.getVolume(user, currentPath);
    }
}

package com.edxp._core.common.converter;

import com.edxp._core.common.utils.FileUtil;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import java.io.*;
import java.nio.file.Files;

public class FileConverter {
    public static MultipartFile convertFileToMultipartFile(File file) {
        FileItem fileItem;

        try {
            fileItem = new DiskFileItem("file", Files.probeContentType(file.toPath()), false, file.getName(), (int) file.length(), file.getParentFile());

            InputStream fis = new FileInputStream(file);
            OutputStream fos = fileItem.getOutputStream();
            IOUtils.copy(fis, fos);

            fis.close();
            fos.close();
        } catch (IOException e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Converting failed");
        } finally {
            FileUtil.remove(file);
        }

        return new CommonsMultipartFile(fileItem);
    }

    public static Resource convertMultipartFileToResource(MultipartFile multipartFile) throws IOException {
        byte[] fileBytes = multipartFile.getBytes();

        return new ByteArrayResource(fileBytes) {
            @Override
            public String getFilename() {
                return multipartFile.getOriginalFilename(); // 파일 이름 설정
            }
        };
    }
}

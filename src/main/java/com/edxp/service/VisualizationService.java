package com.edxp.service;

import com.edxp._core.common.utils.FileUtil;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.domain.doc.PlantModel;
import com.edxp.dto.request.VisualizationDrawRequest;
import com.edxp.dto.response.VisualizationDrawResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Slf4j
@RequiredArgsConstructor
@Service
public class VisualizationService {
    private final FileService fileService;

    @Transactional(readOnly = true)
    public MultiValueMap<String, Object> getResultDraw(Long userId, VisualizationDrawRequest request) throws IOException {
        File file = fileService.downloadAnalysisFile(userId, request.getFileName(), "draw");
        unzipFile(changeFileName(file));

        String targetPath = file.getPath().substring(0, file.getPath().lastIndexOf(".")) + "/" + "PlantModel.xml";
        String imagePath = file.getPath().substring(0, file.getPath().lastIndexOf(".")) + "/" + "SourceImage.png";
        try {
            File targetFile = new File(targetPath);
            FileSystemResource imageFile = new FileSystemResource(imagePath);

            // JAXBContext 생성
            JAXBContext jaxbContext = JAXBContext.newInstance(PlantModel.class);

            // Unmarshaller 생성
            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();

            // XML 을 자바 객체로 언마샬링
            PlantModel plantModel = (PlantModel) jaxbUnmarshaller.unmarshal(targetFile);

            return new LinkedMultiValueMap<>() {{
                add("result", VisualizationDrawResponse.from(plantModel));
                add("file", imageFile);
            }};
        } catch (JAXBException e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "xml converting is failed");
        }
    }

    // 파일 이름 변경
    private Path changeFileName(File file) throws IOException {
        Path ipidPath = Path.of(file.getPath());
        Path zipPath = null;
        try {
            // 파일 이름 변경
            String zipFileName = changeFileExtension(file.getName(), "zip");

            zipPath = Path.of(file.getParent() + "/" + zipFileName);
            // 원본 파일을 새로운 이름으로 복사
            Files.copy(ipidPath, zipPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new EdxpApplicationException(ErrorCode.FILE_NOT_FOUND);
        } finally {
            assert zipPath != null;
            log.info("File name changed to: {}", zipPath.getFileName());
            FileUtil.remove(ipidPath.toFile());
        }

        return zipPath;
    }

    private String changeFileExtension(String fileName, String newExtension) {
        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex != -1) {
            return fileName.substring(0, lastDotIndex + 1) + newExtension;
        }
        return fileName + "." + newExtension;
    }

    // 압축 해제
    public void unzipFile(Path sourceFilePath) throws IOException {
        Path targetDir = extractAndCreateFolder(sourceFilePath);

        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(sourceFilePath.toFile()))) {

            // list files in zip
            ZipEntry zipEntry = zis.getNextEntry();
            while (zipEntry != null) {

                boolean isDirectory = zipEntry.getName().endsWith(File.separator);

                Path newPath = zipSlipProtect(zipEntry, targetDir);
                if (isDirectory) {
                    Files.createDirectories(newPath);
                } else {
                    if (newPath.getParent() != null) {
                        if (Files.notExists(newPath.getParent())) {
                            Files.createDirectories(newPath.getParent());
                        }
                    }
                    // copy files
                    Files.copy(zis, newPath, StandardCopyOption.REPLACE_EXISTING);
                }

                zipEntry = zis.getNextEntry();
            }

            zis.closeEntry();
        } catch (IOException e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "압축 해제에 실패하였습니다.");
        } finally {
            log.info("unzip is success: {}", sourceFilePath.getFileName());
            FileUtil.remove(sourceFilePath.toFile());
        }
    }

    private static Path extractAndCreateFolder(Path sourceZipPath) throws IOException {
        // Extract folder name from the zip file name
        String zipFileName = sourceZipPath.getFileName().toString();
        String folderName = zipFileName.substring(0, zipFileName.lastIndexOf("."));

        // Create destination folder path
        Path destFolderPath = Paths.get(sourceZipPath.getParent().toString(), folderName);

        // Create the folder if it doesn't exist
        try {
            Files.createDirectory(destFolderPath);
        } catch (FileAlreadyExistsException e) {
            // If the folder already exists, do nothing
        }

        return destFolderPath;
    }

    public static Path zipSlipProtect(ZipEntry zipEntry, Path targetDir) throws IOException {
        // test zip slip vulnerability
        Path targetDirResolved = targetDir.resolve(zipEntry.getName());

        // make sure normalized file still has targetDir as its prefix
        // else throws exception
        Path normalizePath = targetDirResolved.normalize();
        if (!normalizePath.startsWith(targetDir)) {
            throw new IOException("Bad zip entry: " + zipEntry.getName());
        }
        return normalizePath;
    }
}

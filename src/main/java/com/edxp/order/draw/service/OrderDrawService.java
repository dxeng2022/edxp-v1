package com.edxp.order.draw.service;

import com.edxp._core.common.utils.FileUtil;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.order.draw.model.PlantModel;
import com.edxp.order.draw.dto.request.OrderDrawRequest;
import com.edxp.order.draw.dto.response.OrderDrawResponse;
import com.edxp.s3file.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
public class OrderDrawService {
    private final FileService fileService;

    @Value("${file.path}")
    private String downloadFolder;

    public OrderDrawResponse getResultDraw(Long userId, OrderDrawRequest request) {
        File file = fileService.downloadAnalysisFile(userId, request.getFilePath(), "draw");

        unzipFile(changeFileName(file));

        PlantModel plantModel = getPlantModel(file);

        return OrderDrawResponse.from(plantModel);
    }

    public OrderDrawResponse getResultLocal(Long userId, MultipartFile multipartFile) {
        File file = FileUtil.createFile(createPath(userId), multipartFile);

        unzipFile(changeFileName(file));

        PlantModel plantModel = getPlantModel(file);

        return OrderDrawResponse.from(plantModel);
    }

    public FileSystemResource getResultImage(Long userId, OrderDrawRequest request) {
        StringBuilder userPath = getUserPath(userId);
        String folderPath = downloadFolder + "/" + userPath + "/" + request.getFilePath().substring(0, request.getFilePath().lastIndexOf("."));
        try {
            return new FileSystemResource(folderPath + "/" + "SourceImage.png");
        } catch (Exception e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "이미지를 불러올 수 없습니다.");
        }
    }

    public void deleteResult(Long userId) {
        FileUtil.remove(new File(createPath(userId)));
    }

    // xml 데이터 파싱
    private static PlantModel getPlantModel(File file) {
        String targetPath = file.getPath().substring(0, file.getPath().lastIndexOf(".")) + "/" + "PlantModel.xml";
        PlantModel plantModel;
        try {
            File targetFile = new File(targetPath);

            // JAXBContext 생성
            JAXBContext jaxbContext = JAXBContext.newInstance(PlantModel.class);

            // Unmarshaller 생성
            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();

            // XML 을 자바 객체로 언마샬링
            plantModel = (PlantModel) jaxbUnmarshaller.unmarshal(targetFile);
        } catch (JAXBException e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "xml converting is failed");
        }

        return plantModel;
    }

    // 다운로드 경로 확인
    private StringBuilder getUserPath(Long userId) {
        StringBuilder userPath = new StringBuilder();
        userPath.append("user_").append(String.format("%06d", userId)).append("/").append("draw");
        return userPath;
    }

    private String createPath(Long userId) {
        return downloadFolder + "/" + "user_" + String.format("%06d", userId) + "/" + "draw";
    }

    // 파일 이름 변경
    private Path changeFileName(File file) {
        Path ipidPath = Path.of(file.getPath());
        Path zipPath = null;

        try {
            // 파일 이름 변경
            String zipFileName = FileUtil.changeFileExtension(file.getName(), "zip");

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

    // 압축 해제
    public void unzipFile(Path sourceFilePath) {
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

    // 파일 추출 및 폴더 생성
    private static Path extractAndCreateFolder(Path sourceZipPath) {
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
        } catch (IOException e) {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "create folder is failed");
        }

        return destFolderPath;
    }

    // 압축 해제 보안
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

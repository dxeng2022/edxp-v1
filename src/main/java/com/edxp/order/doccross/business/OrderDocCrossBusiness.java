package com.edxp.order.doccross.business;

import com.edxp._core.common.annotation.Business;
import com.edxp._core.common.utils.FileUtil;
import com.edxp.order.doccross.converter.OrderDocCrossConverter;
import com.edxp.order.doccross.dto.OrderDocCrossRequest;
import com.edxp.order.doccross.dto.OrderDocCrossResponse;
import com.edxp.order.doccross.model.CrossValidationDocument;
import com.edxp.order.doccross.model.CrossValidationVisualization;
import com.edxp.s3file.service.FileService;
import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Business
public class OrderDocCrossBusiness {
    private final OrderDocCrossConverter orderDocCrossConverter;

    private final FileService fileService;

    @Value("${file.path}")
    private String downloadFolder;

    public OrderDocCrossResponse getCrossValidationCloud(Long userId, OrderDocCrossRequest request) {
        final File analysisFile = fileService.downloadAnalysisFile(userId, request.getFilename(), request.getFilePath());

        List<CrossValidationDocument> crossValidationDocuments = readCsv(analysisFile);
        final List<CrossValidationVisualization> crossValidationVisualizations = orderDocCrossConverter.documentToVisualization(crossValidationDocuments);
        FileUtil.remove(analysisFile);

        return orderDocCrossConverter.toResponse(crossValidationDocuments, crossValidationVisualizations);
    }

    public OrderDocCrossResponse getCrossValidationLocal(Long userId, MultipartFile file) {
        final File analysisFile = FileUtil.createFile(createPath(userId), file);

        List<CrossValidationDocument> crossValidationDocuments = readCsv(analysisFile);
        final List<CrossValidationVisualization> crossValidationVisualizations = orderDocCrossConverter.documentToVisualization(crossValidationDocuments);
        FileUtil.remove(analysisFile);

        return orderDocCrossConverter.toResponse(crossValidationDocuments, crossValidationVisualizations);
    }

    private String createPath(Long userId) {
        return downloadFolder + "/" + "user_" + String.format("%06d", userId) + "/" + "doc";
    }

    private List<CrossValidationDocument> readCsv(File file) {
        CsvMapper mapper = new CsvMapper();
        CsvSchema schema = mapper.schemaWithHeader().withColumnSeparator(',');

        MappingIterator<CrossValidationDocument> it;
        try {
            it = mapper.readerFor(CrossValidationDocument.class).with(schema).readValues(file);

            return it.readAll();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

package com.edxp.dto.response;

import com.amazonaws.services.s3.model.S3ObjectSummary;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

import static com.edxp._core.common.utils.FileUtil.getSizeFormat;

@Getter
@AllArgsConstructor
public class FileVolumeResponse {
    private String volume;
    private long originalVolume;

    public static FileVolumeResponse from(List<S3ObjectSummary> s3ObjectSummaries) {
        long originalVolume = s3ObjectSummaries.stream().mapToLong(S3ObjectSummary::getSize).sum();
        String volume = getSizeFormat(originalVolume);
        return new FileVolumeResponse(
                volume,
                originalVolume
        );
    }
}

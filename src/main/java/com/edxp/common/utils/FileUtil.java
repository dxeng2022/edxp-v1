package com.edxp.common.utils;

import com.amazonaws.services.s3.transfer.Transfer;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;

@Slf4j
public class FileUtil {
    public static void remove(File file) throws IOException {
        if (file.isDirectory()) {
            removeDirectory(file);
        } else {
            removeFile(file);
        }
    }

    public static void removeDirectory(File directory) throws IOException {
        File[] files = directory.listFiles();
        for (File file : files) {
            remove(file);
        }
        removeFile(directory);
    }

    public static void removeFile(File file) throws IOException {
        if (file.delete()) {
            log.info("File [" + file.getName() + "] delete success");
            return;
        }
        throw new FileNotFoundException("File [" + file.getName() + "] delete fail");
    }

    public static boolean isDownOver(ArrayList<Transfer> list) {
        for(Transfer download : list) {
            if(!download.isDone()) {
                return false;
            }
        }
        return list.size() > 0;
    }

    public static double getAverageList(ArrayList<Transfer> list) {
        double sum = 0;
        for(Transfer download : list) {
            sum += download.getProgress().getPercentTransferred();
        }
        return sum / list.size();
    }
}

package com.edxp.common.utils;

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

    public static boolean isDownOver(ArrayList<Boolean> list) {
        for(boolean done : list) {
            if(!done) {
                return false;
            }
        }
        return list.size() > 0;
    }

    public static double getAverageList(ArrayList<Double> list) {
        double sum = 0;
        for(Double value : list) {
            sum += value;
        }
        return sum / list.size();
    }
}

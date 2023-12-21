package com.edxp._core.common.utils;

import com.amazonaws.services.s3.transfer.Transfer;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

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
        assert files != null;
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

    public static String getEncodedFileName(HttpServletRequest httpRequest, String fileName) {
        HashMap<String, String> headerMap = new HashMap<>();

        Enumeration<String> headers = httpRequest.getHeaderNames();
        while (headers.hasMoreElements()) {
            String name = headers.nextElement();
            String value = httpRequest.getHeader(name);
            headerMap.put(name, value);
        }

        String agent = headerMap.get("user-agent");

        if (agent != null) {
            if (agent.contains("Edge") || agent.contains("MSIE") || agent.contains("Trident")) {
                return URLEncoder.encode(fileName, StandardCharsets.UTF_8).replaceAll("\\+", "%20");
            }

            if (agent.contains("Chrome") || agent.contains("Opera") || agent.contains("Firefox")) {
                return new String(fileName.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1);
            }

            if (agent.contains("Postman")) {
                String test = new String(fileName.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1);
                return test;
            }
        }

        String extension = fileName.substring(fileName.lastIndexOf("."));

        return "downloaded_file" + extension;
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

    public static String getDateFormat(Date date) {
        Calendar s3Date = Calendar.getInstance();
        s3Date.setTime(date);
        s3Date.add(Calendar.HOUR, 9);
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy. MM. dd. a hh:mm:ss");
        return dateFormat.format(date);
    }

    public static String getSizeFormat(Long size) {
        StringBuilder fileSize = new StringBuilder();
        long oneByte = 1024;
        if (size == 0) {
            fileSize.append("-");
        } else if (0 < size && size < Math.pow(oneByte, 2)) {
            fileSize.append(String.format("%.1f", ((double) size) / 1024)).append(" KB");
        } else if (Math.pow(oneByte, 2) <= size && size < Math.pow(oneByte, 3)) {
            fileSize.append(String.format("%.1f", ((double) size) / Math.pow(1024, 2))).append(" MB");
        } else if (Math.pow(oneByte, 3) <= size && size < Math.pow(oneByte, 4)) {
            fileSize.append(String.format("%.1f", ((double) size) / Math.pow(1024, 3))).append(" GB");
        } else if (Math.pow(oneByte, 4) <= size) {
            fileSize.append(String.format("%.1f", ((double) size) / Math.pow(1024, 4))).append(" TB");
        } else {
            fileSize.append(size).append(" byte");
        }
        return fileSize.toString();
    }
}

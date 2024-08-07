package com.edxp._core.common.utils;

import com.edxp._core.model.StandardDate;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class DateUtil {

    public static String formatDate(Timestamp timestamp) {
        if (timestamp == null) return "";

        String result = null;
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
            result = formatter.format(new Date(timestamp.getTime()));
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    public static String getDateFormat(Date date) {
        Calendar s3Date = Calendar.getInstance();
        s3Date.setTime(date);
        s3Date.add(Calendar.HOUR, 9);
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy. MM. dd. a hh:mm:ss");

        return dateFormat.format(date);
    }

    public static LocalDateTime parseStringToLocalDateTime(String dateString) {
        dateString = dateString.replace("오전", "AM").replace("오후", "PM");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy. MM. dd. a hh:mm:ss", Locale.ENGLISH);

        return LocalDateTime.parse(dateString, formatter);
    }

    public static StandardDate getStandardDate() {
        LocalDateTime now = LocalDateTime.now();

        LocalDateTime startDateLocal;
        LocalDateTime endDateLocal;
        // 현재 시간이 오전 9시 이전이면 전날 오전 9시부터 오늘 오전 9시까지
        if (now.toLocalTime().isBefore(LocalTime.of(9, 0))) {
            startDateLocal = now.minusDays(1).withHour(9).withMinute(0).withSecond(0).withNano(0); // 전날 오전 9시
            endDateLocal = now.withHour(9).withMinute(0).withSecond(0).withNano(0); // 오늘 오전 9시
        } else {
            // 현재 시간이 오전 9시 이후이면 오늘 오전 9시부터 내일 오전 9시까지
            startDateLocal = now.withHour(9).withMinute(0).withSecond(0).withNano(0); // 오늘 오전 9시
            endDateLocal = now.plusDays(1).withHour(9).withMinute(0).withSecond(0).withNano(0); // 내일 오전 9시
        }

        Timestamp startDate = Timestamp.valueOf(startDateLocal);
        Timestamp endDate = Timestamp.valueOf(endDateLocal);

        return StandardDate.of(startDate, endDate);
    }
}

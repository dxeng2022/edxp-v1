package com.edxp._core.common.utils;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
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
}

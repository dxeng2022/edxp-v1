package com.edxp._core.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.sql.Timestamp;

@AllArgsConstructor
@Getter
public class StandardDate {
    private Timestamp startDate;
    private Timestamp endDate;

    public static StandardDate of(Timestamp startDate, Timestamp endDate) {
        return new StandardDate(startDate, endDate);
    }
}

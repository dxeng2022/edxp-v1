package com.edxp._core.common.utils;

import com.edxp.order.doc.dto.response.OrderDocVisualListResponse;

import java.time.LocalDateTime;
import java.util.List;

public class SortUtil {
    public static void sortByExtractedDate(List<OrderDocVisualListResponse> list) {
        list.sort((o1, o2) -> {
            LocalDateTime date1 = o1.getOriginalExtractedDate();
            LocalDateTime date2 = o2.getOriginalExtractedDate();

            return date2.compareTo(date1);
        });
    }
}

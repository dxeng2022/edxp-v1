package com.edxp.order.doc.business;

import com.edxp._core.common.annotation.Business;
import com.edxp.order.doc.dto.response.OrderDocCountResponse;
import com.edxp.user.dto.User;
import com.edxp.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Business
public class OrderDocAdminBusiness {
    private final OrderDocBusiness orderDocBusiness;

    private final UserService userService;


    public OrderDocCountResponse getUserParsingCount(Long userId) {
        final User user = userService.getUser(userId);

        return orderDocBusiness.getParsingCount(user);
    }

    public OrderDocCountResponse getUserExtractCount(Long userId) {
        final User user = userService.getUser(userId);

        return orderDocBusiness.getExtractCount(user);
    }
}

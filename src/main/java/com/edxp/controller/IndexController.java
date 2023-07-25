package com.edxp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {
    @GetMapping({"/", "/error"})
    public String index() {
        return "index.html";
    }

//    @GetMapping(value = {
//            "/module/**", "/mypage/**",
//            "/module/draw/**", "/module/sheet/**", "/module/doc/**",
//            "/module/draw/download", "/module/sheet/download", "/module/doc/choice",
//            "/module/draw/cloud", "/module/sheet/cloud", "/module/doc/cloud"
//    })
//    public String modulePage() {
//        return "index.html";
//    }

    @GetMapping(value = {"/module/**", "/mypage/**"})
    public String modulePage() {
        return "index.html";
    }
}

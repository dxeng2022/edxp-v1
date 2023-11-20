package com.edxp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@RequiredArgsConstructor
@Controller
public class IndexController {
    @GetMapping({"/"})
    public String index() {
        return "index.html";
    }

    @GetMapping(value = {"/module/**", "/mypage/**"})
    public String modulePage() {
        return "index.html";
    }

    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        return "forward:/";
    }
}

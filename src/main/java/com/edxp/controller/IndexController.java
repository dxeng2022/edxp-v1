package com.edxp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {
    @GetMapping({"/", "/error"})
    public String index() {
        return "index.html";
    }

    @GetMapping("/module")
    public String modulePage() {
        return "index.html";
    }
}

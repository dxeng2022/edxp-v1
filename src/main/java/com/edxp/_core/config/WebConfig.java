package com.edxp._core.config;

import com.edxp._core.interceptor.SecurityInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Bean
    public SecurityInterceptor securityInterceptor() {
        return new SecurityInterceptor();
    }

    private final String[] OPEN_ADDRESS = {
            "/", "/log", "/login",
            "/isLogin", "/public-key", "/log",
            "/api/v1/user/signup", "/api/v1/user/check-dupl", "/api/v1/user/signup-auth", "/api/v1/user/signup-authcheck",
            "/api/v1/user/find-mail",  "/api/v1/user/find-pw"
    };

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 모든 경로에 대해 Interceptor 를 적용
        registry.addInterceptor(securityInterceptor())
                .excludePathPatterns(OPEN_ADDRESS);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/")
                .setViewName("forward:/");
        registry.addViewController("/{spring:\\w+}")
                .setViewName("forward:/");
        registry.addViewController("/**/{spring:\\w+}")
                .setViewName("forward:/");
    }
}

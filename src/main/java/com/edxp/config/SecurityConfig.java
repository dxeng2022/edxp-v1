package com.edxp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.servlet.http.HttpServletResponse;

@EnableWebSecurity
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf().disable()
                .cors().configurationSource(corsConfigurationSource())
                .and()
                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers(
//                                "/user/**"
//                        ).authenticated()
                                .anyRequest().permitAll()
                )
                .formLogin()
                    .successHandler((request, response, authentication) -> {
                        // 로그인 성공 시 JSON 응답을 리턴
                        response.setStatus(HttpServletResponse.SC_OK);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"success\": true}");
                    })
                    .failureHandler((request, response, exception) -> {
                        // 로그인 실패 시 JSON 응답을 리턴
                        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"success\": false}");
                    })
                    .permitAll()
//                    .loginPage("/")
//                    .loginProcessingUrl("/login")
//                    .defaultSuccessUrl("/module")
//                    .failureUrl("/login-error")
                .and()
                .logout()
                    .logoutUrl("/logout") // 로그아웃 URL 설정
                    .invalidateHttpSession(true) // 세션 무효화
                    .clearAuthentication(true) // 인증 정보 제거
                    .deleteCookies("JSESSIONID") // 쿠키 삭제 (세션 쿠키 이름)
                    .logoutSuccessHandler((request, response, authentication) -> {
                        // 로그아웃 성공 시 처리 (옵션)
                        response.setStatus(HttpServletResponse.SC_OK);
                    })
                    .permitAll()
                .and()
                .build();
    }

    @Bean
    public BCryptPasswordEncoder encodePwd() {
        return new BCryptPasswordEncoder();
    }

    // login cors 문제 해결
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

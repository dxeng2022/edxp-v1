package com.edxp._core.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.servlet.http.HttpServletResponse;

@Slf4j
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
//                .sessionManagement(sessionManagement -> sessionManagement
//                            .maximumSessions(1)
//                            .maxSessionsPreventsLogin(true)
//                            .expiredUrl("/session-expired")
//                            .sessionRegistry(sessionRegistry())
//                )
                .formLogin()
                    .successHandler((request, response, authentication) -> {
                        log.info("로그인 성공");
                        // 로그인 성공 시 JSON 응답을 리턴
                        response.setStatus(HttpServletResponse.SC_OK);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"success\": true}");
                    })
                    .failureHandler((request, response, exception) -> {
                        log.info("로그인 실패");
                        // 로그인 실패 시 JSON 응답을 리턴
                        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"success\": false}");
                    })
                    .permitAll()
                .and()
                .logout()
                    .logoutUrl("/logout") // 로그아웃 URL 설정
                    .deleteCookies("JSESSIONID")
                    .invalidateHttpSession(true)
                    .clearAuthentication(true)
//                    .addLogoutHandler((request, response, authentication) -> {
//                        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//                        if (principal instanceof PrincipalDetails) {
//                            UserDetails userDetails = (PrincipalDetails) principal;
//                            List<SessionInformation> sessions = sessionRegistry().getAllSessions(userDetails, false);
//
//                            // 세션 정보를 만료시켜 SessionRegistry 를 최신화
//                            for (SessionInformation session : sessions) {
//                                session.expireNow();
//                            }
//                        }
//                    })
                    .logoutSuccessHandler((request, response, authentication) -> {
                        // 로그아웃 성공 시 처리 (옵션)
                        response.setStatus(HttpServletResponse.SC_OK);
                    })
                    .permitAll()
                .and()
                .build();
    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
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

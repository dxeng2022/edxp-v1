package com.edxp._core.config;

import com.edxp._core.config.auth.PrincipalDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.servlet.http.HttpServletResponse;

@Slf4j
@RequiredArgsConstructor
@EnableWebSecurity
@Configuration
public class SecurityConfig {
    private final PrincipalDetailsService principalDetailsService;

    private final String[] OPEN_ADDRESS = {
            "/", "/log", "/login",
            "/isLogin", "/public-key", "/log",
            "/api/v1/user/signup", "/api/v1/user/check-dupl", "/api/v1/user/signup-auth", "/api/v1/user/signup-authcheck",
            "/api/v1/user/find-mail",  "/api/v1/user/find-pw"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .csrf().disable()
                .cors().configurationSource(corsConfigurationSource())
                .and()
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers(
//                                "/user/**"
//                        ).authenticated()
//                                .anyRequest().permitAll()
//                )
                .authorizeRequests()
                    .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                    .antMatchers(
                            OPEN_ADDRESS
                    ).permitAll()
                    .antMatchers("/admin/**").hasRole("ADMIN")
//                    .anyRequest().permitAll()
                .and()
                .formLogin()
                    .loginPage("/")
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
                .sessionManagement(sessionManagement -> sessionManagement
                            .maximumSessions(1)
                            .maxSessionsPreventsLogin(true)
//                            .sessionRegistry(sessionRegistry())
                )
                .logout()
                    .logoutUrl("/logout") // 로그아웃 URL 설정
                    .invalidateHttpSession(true) // 세션 무효화
                    .deleteCookies("JSESSIONID")
                    .logoutSuccessHandler((request, response, authentication) -> {
                        // 로그아웃 성공 시 처리 (옵션)
                        response.setStatus(HttpServletResponse.SC_OK);
                    })
                    .permitAll()
                .and()
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(encodePwd());
        provider.setUserDetailsService(principalDetailsService);
        return new ProviderManager(provider);
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

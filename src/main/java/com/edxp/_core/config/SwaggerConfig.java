package com.edxp._core.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.List;

@Configuration
public class SwaggerConfig {
    @Bean
    @Profile({"local"})
    public OpenAPI customOpenAPILocal() {
        Server server = new Server();
        server.setUrl("http://localhost:8080");
        server.setDescription("Local");

        return new OpenAPI()
                .info(new Info()
                        .title("EDXP API")
                        .version("1.0")
                        .description("This is API Document of EDXP"))
                .servers(List.of(server));
    }

    @Bean
    @Profile({"dev"})
    public OpenAPI customOpenAPIDev() {
        Server server = new Server();
        server.setUrl("http://54.180.127.223");
        server.setDescription("Dev");

        return new OpenAPI()
                .info(new Info()
                        .title("EDXP API Dev")
                        .version("1.0")
                        .description("This is API Document of EDXP for Dev"))
                .servers(List.of(server));
    }
}

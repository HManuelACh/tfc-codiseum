package com.hmach.codiseum.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${frontend.url}")
    private String FRONTEND_URL;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")                              // Permite todas las rutas
            .allowedOrigins(FRONTEND_URL)                           // Permite peticiones desde el frontend
            .allowedMethods("GET", "POST", "PUT", "DELETE")         // Métodos permitidos
            .allowedHeaders("*")                                    // Permite cualquier tipo de encabezado
            .allowCredentials(true);                                // Permite el uso de cookies
    }
}
package com.giocoTelegram.totosanremoserver.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("https://localhost:3000") // Permette richieste CORS dal tuo frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // Specifica i metodi consentiti
                        .allowedHeaders("*") // Permette tutti gli headers
                        .allowCredentials(true) // Permette l'invio di credenziali, come i cookie
                        .maxAge(3600); // Imposta la durata massima della cache delle risposte di preflight (in secondi)
            }
        };

    }

}


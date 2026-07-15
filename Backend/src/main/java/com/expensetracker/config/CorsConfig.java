package com.expensetracker.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * CORS configuration to allow the frontend (running on a different origin)
 * to communicate with this REST API.
 *
 * <p>In development, all localhost ports are permitted.
 * In production, set ALLOWED_ORIGIN to your Vercel frontend URL.</p>
 */
@Configuration
public class CorsConfig {

    @Value("${ALLOWED_ORIGIN:}")
    private String allowedOriginEnv;

    /**
     * Registers a global CORS filter with origins from env + localhost fallback.
     *
     * @return the configured {@link CorsFilter}
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);

        List<String> patterns = new ArrayList<>(Arrays.asList(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "https://*.vercel.app",
                "https://*.railway.app",
                "https://*.onrender.com"
        ));

        // Also add any explicit origin set via env variable (e.g. https://expense-tracker.vercel.app)
        if (allowedOriginEnv != null && !allowedOriginEnv.isBlank()) {
            patterns.add(allowedOriginEnv.trim());
        }

        config.setAllowedOriginPatterns(patterns);
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setExposedHeaders(List.of("Authorization", "Content-Type"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}

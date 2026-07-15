package com.expensetracker.config;

import com.expensetracker.security.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Declares infrastructure beans required by Spring Security:
 * {@link PasswordEncoder}, {@link AuthenticationProvider}, and {@link AuthenticationManager}.
 *
 * <p>The {@link AuthenticationManager} is built explicitly as a {@link ProviderManager}
 * wrapping our {@link DaoAuthenticationProvider}. This eliminates any ambiguity about
 * which provider is actually used during login — Spring Boot's auto-configuration
 * cannot interfere.</p>
 */
@Configuration
public class ApplicationConfig {

    private final CustomUserDetailsService userDetailsService;

    public ApplicationConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    /**
     * BCrypt password encoder with the default strength factor (10).
     *
     * @return configured {@link BCryptPasswordEncoder}
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * DAO-based authentication provider wired with our {@link CustomUserDetailsService}
     * and BCrypt encoder.
     *
     * @return configured {@link DaoAuthenticationProvider}
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * Builds an {@link AuthenticationManager} explicitly from our own
     * {@link DaoAuthenticationProvider}.
     *
     * <p>Using {@link ProviderManager} directly (instead of delegating to
     * {@code AuthenticationConfiguration.getAuthenticationManager()}) guarantees
     * that the manager uses <em>our</em> BCrypt encoder and {@link CustomUserDetailsService},
     * not any Spring Boot auto-configured alternative.</p>
     *
     * @return a {@link ProviderManager} backed by the DAO authentication provider
     */
    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(authenticationProvider());
    }
}

package com.tripnest.tripnest_backend.config;

import com.tripnest.tripnest_backend.security.CustomAccessDeniedHandler;
import com.tripnest.tripnest_backend.security.CustomAuthenticationEntryPoint;
import com.tripnest.tripnest_backend.security.JwtAuthFilter;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomAccessDeniedHandler accessDeniedHandler;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;

    /*
     * CORS origin is read from the environment variable:
     *
     * CORS_ORIGIN
     *
     * Render:
     * CORS_ORIGIN=https://travel-planning-trip-management-pla-pi.vercel.app
     *
     * For local development, localhost:3000 is used by default.
     */
    @Value("${CORS_ORIGIN:http://localhost:3000}")
    private String corsOrigin;


    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // =========================================================
    // CORS CONFIGURATION
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        /*
         * Allowed frontend origins.
         *
         * Render environment variable:
         * CORS_ORIGIN
         *
         * Vercel production URL is also explicitly included
         * as a fallback.
         */
        config.setAllowedOriginPatterns(List.of(
                corsOrigin,
                "https://travel-planning-trip-management-pla-pi.vercel.app",
                "http://localhost:3000",
                "http://127.0.0.1:3000"
        ));

        /*
         * HTTP methods allowed from the frontend.
         */
        config.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        /*
         * Allow all request headers.
         *
         * This is required for headers such as:
         * Authorization
         * Content-Type
         */
        config.setAllowedHeaders(List.of("*"));

        /*
         * Allow credentials such as authorization information
         * and cookies when applicable.
         */
        config.setAllowCredentials(true);

        /*
         * Allow frontend JavaScript to read the Authorization
         * response header.
         */
        config.setExposedHeaders(List.of(
                "Authorization"
        ));

        /*
         * Browser can cache the CORS preflight response
         * for one hour.
         */
        config.setMaxAge(3600L);


        /*
         * Register CORS configuration for all API endpoints.
         */
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }


    // =========================================================
    // SPRING SECURITY CONFIGURATION
    // =========================================================

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
            throws Exception {

        http

            // -------------------------------------------------
            // Enable CORS
            // -------------------------------------------------
            .cors(Customizer.withDefaults())


            // -------------------------------------------------
            // Disable CSRF
            // -------------------------------------------------
            // This application uses JWT authentication and
            // is designed as a stateless REST API.
            // -------------------------------------------------
            .csrf(csrf -> csrf.disable())


            // -------------------------------------------------
            // Stateless Session
            // -------------------------------------------------
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )


            // -------------------------------------------------
            // Authorization Rules
            // -------------------------------------------------
            .authorizeHttpRequests(auth -> auth

                /*
                 * Browser CORS preflight requests.
                 *
                 * Browsers send OPTIONS before certain
                 * cross-origin requests.
                 */
                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()


                /*
                 * Authentication endpoints are public.
                 *
                 * Examples:
                 * /api/auth/login
                 * /api/auth/register
                 */
                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()


                /*
                 * Weather API is public.
                 */
                .requestMatchers(
                    "/weather/**"
                ).permitAll()


                /*
                 * Destination search is public.
                 */
                .requestMatchers(
                    HttpMethod.GET,
                    "/destinations/search"
                ).permitAll()


                /*
                 * All other endpoints require authentication.
                 */
                .anyRequest().authenticated()
            )


            // -------------------------------------------------
            // Exception Handling
            // -------------------------------------------------
            .exceptionHandling(ex -> ex
                .accessDeniedHandler(accessDeniedHandler)
                .authenticationEntryPoint(authenticationEntryPoint)
            )


            // -------------------------------------------------
            // JWT Authentication Filter
            // -------------------------------------------------
            .addFilterBefore(
                jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class
            );


        return http.build();
    }
}
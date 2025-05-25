package com.hmach.codiseum.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.http.ResponseCookie;

import com.hmach.codiseum.enumeration.LeagueEnum;
import com.hmach.codiseum.enumeration.RoleEnum;
import com.hmach.codiseum.model.CustomUserDetails;
import com.hmach.codiseum.model.User;
import com.hmach.codiseum.security.JwtAuthenticationFilter;
import com.hmach.codiseum.service.JwtTokenProvider;
import com.hmach.codiseum.service.UserService;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @Value("${frontend.url}")
    private String FRONTEND_URL;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of(FRONTEND_URL));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setAllowCredentials(true);
                    return config;
                }))
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/logout").permitAll()
                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(customAuthenticationSuccessHandler()))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"authenticated\":false}");
                        }));

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationSuccessHandler customAuthenticationSuccessHandler() {
        return (HttpServletRequest request, HttpServletResponse response, Authentication authentication) -> {

            OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
            String email = oauthUser.getAttribute("email");
            String googleId = oauthUser.getAttribute("sub");

            User existingUser = userService.getUserByGoogleId(googleId);

            if (existingUser == null) {
                User newUser = new User(
                        null,
                        googleId,
                        null,
                        email,
                        RoleEnum.ROLE_USER,
                        0,
                        LeagueEnum.BRONCE,
                        null,
                        LocalDateTime.now(),
                        true);

                String randomUsername = userService.generateRandomUsername();
                newUser.setUsername(randomUsername);

                userService.registerUser(newUser);
                existingUser = newUser;
            } else {
                userService.updateLastLogin(existingUser);
            }

            CustomUserDetails userDetails = new CustomUserDetails(existingUser);

            Authentication customAuth = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(customAuth);

            String token = jwtTokenProvider.generateToken(customAuth);

            // Crear cookie HttpOnly
            ResponseCookie cookie = ResponseCookie.from("jwt_token", token)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(86400) // 1 día de expiración
                    .sameSite("Lax")
                    .build();

            response.addHeader("Set-Cookie", cookie.toString()); // Agregamos la cookie a la respuesta
            response.sendRedirect(FRONTEND_URL + "/play"); // Redirigir a la página de juego
        };
    }
}
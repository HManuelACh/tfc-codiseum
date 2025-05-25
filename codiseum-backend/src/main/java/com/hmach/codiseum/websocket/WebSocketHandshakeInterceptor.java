package com.hmach.codiseum.websocket;

import com.hmach.codiseum.model.User;
import com.hmach.codiseum.service.JwtTokenProvider;
import com.hmach.codiseum.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

@Component
public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

    private static final String JWT_COOKIE_NAME = "jwt_token";
    private static final String USER_ATTRIBUTE = "googleId";

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserService userService;

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception {

        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpServletRequest = servletRequest.getServletRequest();

            String token = extractToken(httpServletRequest);

            if (token != null && jwtTokenProvider.validateToken(token)) {
                // Obtener email del token
                String email = jwtTokenProvider.getUsernameFromToken(token);
                User user = userService.getUserByEmail(email);
                if (user != null) {
                    // Guardar googleId en atributos para usar en WebSocketSession
                    attributes.put(USER_ATTRIBUTE, user.getGoogleId());
                    return true;
                }
            }

            response.setStatusCode(org.springframework.http.HttpStatus.FORBIDDEN);
            return false;
        }

        return false;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {
    }

    private String extractToken(HttpServletRequest request) {
        // Buscar en cookies
        if (request.getCookies() != null) {
            Optional<Cookie> jwtCookie = Arrays.stream(request.getCookies())
                    .filter(cookie -> JWT_COOKIE_NAME.equals(cookie.getName()))
                    .findFirst();

            if (jwtCookie.isPresent()) {
                return jwtCookie.get().getValue();
            }
        }

        // O buscar en parámetros de la URL (en caso de que la cookie no esté presente)
        return request.getParameter("token");
    }
}
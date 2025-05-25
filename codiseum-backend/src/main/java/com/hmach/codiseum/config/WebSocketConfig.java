package com.hmach.codiseum.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.hmach.codiseum.websocket.WebSocketHandler;
import com.hmach.codiseum.websocket.WebSocketHandshakeInterceptor;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Autowired
    private WebSocketHandler webSocketHandler;
    
    @Autowired
    private WebSocketHandshakeInterceptor webSocketHandshakeInterceptor;

    @Value("${frontend.url}")
    private String FRONTEND_URL;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler, "/ws")
               .addInterceptors(webSocketHandshakeInterceptor)
               .setAllowedOrigins(FRONTEND_URL);
    }
}
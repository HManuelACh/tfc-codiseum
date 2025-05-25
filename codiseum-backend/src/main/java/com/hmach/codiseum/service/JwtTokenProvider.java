package com.hmach.codiseum.service;

import java.util.Base64;
import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;

@Service
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String JWT_SECRET;

    @Value("${jwt.expiration}")
    private long JWT_EXPIRATION;

    private SecretKey key;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Base64.getDecoder().decode(JWT_SECRET);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // Generación del token JWT
    public String generateToken(Authentication authentication) {
        String username = authentication.getName(); // Obtener el nombre de usuario

        return Jwts.builder()
                .subject(username) // en vez de setSubject()
                .issuedAt(new Date()) // en vez de setIssuedAt()
                .expiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION)) // en vez de setExpiration()
                .signWith(key, Jwts.SIG.HS512) // en vez de signWith(..., SignatureAlgorithm.HS512)
                .compact();
    }

    // Obtener el nombre de usuario desde el token
    public String getUsernameFromToken(String token) {

        // Usamos JwtParserBuilder moderno con verifyWith() en vez de setSigningKey()
        JwtParser jwtParser = Jwts.parser()
                .verifyWith(key) // En vez de setSigningKey()
                .build(); // Construimos el JwtParser

        // Parseamos usando parseSignedClaims() y obtenemos el payload (antes getBody())
        Claims claims = jwtParser.parseSignedClaims(token).getPayload(); // En vez de parseClaimsJws().getBody()

        return claims.getSubject(); // Obtener el 'subject' (username)
    }

    // Validar el token JWT
    public boolean validateToken(String token) {
        try {
            // Usamos verifyWith() en lugar de setSigningKey()
            JwtParser jwtParser = Jwts.parser()
                    .verifyWith(key)
                    .build(); // Construimos el JwtParser

            // Validamos usando parseSignedClaims() en lugar de parseClaimsJws()
            jwtParser.parseSignedClaims(token);

            return true; // Si no se lanza excepción, el token es válido
        } catch (Exception e) {
            return false; // Si ocurre una excepción (token expirado, inválido), retornamos false
        }
    }
}
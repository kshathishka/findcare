package com.findcare.backend.security;

import com.findcare.backend.exception.JwtAuthenticationException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {
    
    @Value("${app.jwt.secret:JWTSecretKeyForFindCareApplicationSecureAndStrong2024ExtraSecurePadding!!}")
    private String jwtSecret;
    
    @Value("${app.jwt.expiration:86400000}") // 24 hours in milliseconds
    private long jwtExpiration;
    
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
    
    public String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }
    
    public String getEmailFromToken(String token) {
        Claims claims = parseClaims(token);
        
        return claims.getSubject();
    }
    
    public void validateToken(String token) {
        parseClaims(token);
    }

    private Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (SecurityException ex) {
            throw new JwtAuthenticationException("Invalid JWT signature", "INVALID_TOKEN_SIGNATURE");
        } catch (MalformedJwtException ex) {
            throw new JwtAuthenticationException("Invalid JWT token", "INVALID_TOKEN");
        } catch (ExpiredJwtException ex) {
            throw new JwtAuthenticationException("JWT token has expired", "TOKEN_EXPIRED");
        } catch (UnsupportedJwtException ex) {
            throw new JwtAuthenticationException("Unsupported JWT token", "UNSUPPORTED_TOKEN");
        } catch (IllegalArgumentException ex) {
            throw new JwtAuthenticationException("JWT claims string is empty", "EMPTY_TOKEN");
        }
    }
}

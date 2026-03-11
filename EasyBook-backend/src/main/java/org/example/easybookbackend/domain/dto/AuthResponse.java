package org.example.easybookbackend.domain.dto;


import java.time.Instant;

public record AuthResponse(String token, String tokenType, Instant expiresAt) {
    public static AuthResponse bearer(String token, Instant expiresAt) {
        return new AuthResponse(token, "Bearer", expiresAt);
    }
}
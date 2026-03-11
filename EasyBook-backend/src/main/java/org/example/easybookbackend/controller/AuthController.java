package org.example.easybookbackend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.easybookbackend.domain.dto.AuthRequest;
import org.example.easybookbackend.domain.dto.AuthResponse;
import org.example.easybookbackend.domain.dto.UserDto;
import org.example.easybookbackend.domain.dto.auth.CreateUserRequest;
import org.example.easybookbackend.domain.dto.auth.RegisterUserResponse;
import org.example.easybookbackend.service.serviceImpl.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Validated
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).build();
        }
        String email = authentication.getName();
        return ResponseEntity.ok(authService.currentUser(email));
    }
    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RegisterUserResponse> register(@RequestBody @Valid CreateUserRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

}
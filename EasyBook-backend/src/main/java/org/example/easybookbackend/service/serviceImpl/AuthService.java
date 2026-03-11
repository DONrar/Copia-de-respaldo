package org.example.easybookbackend.service.serviceImpl;

import lombok.RequiredArgsConstructor;
import org.example.easybookbackend.config.JwtService;
import org.example.easybookbackend.domain.dto.AuthRequest;
import org.example.easybookbackend.domain.dto.AuthResponse;
import org.example.easybookbackend.domain.dto.UserDto;
import org.example.easybookbackend.domain.dto.auth.CreateUserRequest;
import org.example.easybookbackend.domain.dto.auth.RegisterUserResponse;
import org.example.easybookbackend.domain.entity.User;
import org.example.easybookbackend.domain.enums.Role;
import org.example.easybookbackend.domain.exception.BusinessException;
import org.example.easybookbackend.repository.UserRepository;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(AuthRequest request) {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                request.email(), request.password());
        authenticationManager.authenticate(auth);

        var user = userRepository.findByEmail(request.email()).orElseThrow();
        String token = jwtService.generateToken(user);
        Instant exp = jwtService.getExpiration(token);
        return AuthResponse.bearer(token, exp);
    }

    public UserDto currentUser(String email) {
        var user = userRepository.findByEmail(email).orElseThrow();
        return new UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.isEnabled());
    }

    public RegisterUserResponse register(CreateUserRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new BusinessException("Email already in use");
        }

        Role role = req.role() != null ? req.role() : Role.GUEST;

        String rawPassword = req.password();
        String temporary = null;
        if (rawPassword == null || rawPassword.isBlank()) {
            temporary = generateTempPassword(12);
            rawPassword = temporary;
        }

        var user = User.builder()
                .email(req.email().toLowerCase(Locale.ROOT).trim())
                .fullName(req.fullName().trim())
                .passwordHash(passwordEncoder.encode(rawPassword))
                .role(role)
                .enabled(true)
                .build();

        user = userRepository.save(user);

        var dto = new UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.isEnabled());
        return new RegisterUserResponse(dto, temporary);
    }

    private static String generateTempPassword(int length) {
        final String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^*._";
        SecureRandom r = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(r.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
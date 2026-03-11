package org.example.easybookbackend.service.serviceImpl;
import lombok.RequiredArgsConstructor;
import org.example.easybookbackend.domain.dto.UserDto;
import org.example.easybookbackend.domain.dto.common.PageResponse;
import org.example.easybookbackend.domain.dto.user.*;
import org.example.easybookbackend.domain.entity.User;
import org.example.easybookbackend.domain.enums.Role;
import org.example.easybookbackend.domain.exception.BusinessException;
import org.example.easybookbackend.domain.exception.ResourceNotFoundException;
import org.example.easybookbackend.repository.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Helpers
    private static UserDetailsDto toDetails(User u) {
        return new UserDetailsDto(u.getId(), u.getEmail(), u.getFullName(), u.getRole(), u.isEnabled());
    }
    private static UserDto toDto(User u) {
        return new UserDto(u.getId(), u.getEmail(), u.getFullName(), u.getRole(), u.isEnabled());
    }

    private static String generateTempPassword(int length) {
        final String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^*._";
        SecureRandom r = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i=0; i<length; i++) sb.append(chars.charAt(r.nextInt(chars.length())));
        return sb.toString();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public UserDetailsDto create(CreateUserRequest req) {
        if (userRepository.existsByEmail(req.email())) throw new BusinessException("Email already in use");
        Role role = req.role() != null ? req.role() : Role.GUEST;

        String rawPassword = req.password();
        if (rawPassword == null || rawPassword.isBlank()) {
            rawPassword = generateTempPassword(12);
        }

        var user = User.builder()
                .email(req.email().toLowerCase(Locale.ROOT).trim())
                .fullName(req.fullName().trim())
                .passwordHash(passwordEncoder.encode(rawPassword))
                .role(role)
                .enabled(true)
                .build();
        user = userRepository.save(user);
        return toDetails(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public PageResponse<UserDetailsDto> list(String search, Role role, Boolean enabled, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page,0), Math.min(Math.max(size,1), 200), Sort.by("createdAt").descending());
        Page<User> p;
        if (search != null && !search.isBlank()) {
            p = userRepository.findByEmailContainingIgnoreCaseOrFullNameContainingIgnoreCase(search, search, pageable);
        } else {
            p = userRepository.findAll(pageable);
        }
        // filtros en memoria simples
        var filtered = p.getContent().stream()
                .filter(u -> role == null || u.getRole() == role)
                .filter(u -> enabled == null || u.isEnabled() == enabled)
                .map(UserService::toDetails)
                .toList();

        // reconstruir PageResponse simple
        return new PageResponse<>(
                filtered,
                page,
                size,
                p.getTotalElements(),
                p.getTotalPages(),
                p.isLast()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public UserDetailsDto get(UUID id) {
        var user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toDetails(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public UserDetailsDto update(UUID id, UpdateUserRequest req) {
        var user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (req.fullName() != null && !req.fullName().isBlank()) user.setFullName(req.fullName().trim());
        if (req.role() != null) user.setRole(req.role());
        if (req.enabled() != null) user.setEnabled(req.enabled());
        return toDetails(userRepository.save(user));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void enable(UUID id, boolean enable) {
        var user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEnabled(enable);
        userRepository.save(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResetPasswordResponse resetPassword(UUID id) {
        var user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String temp = generateTempPassword(12);
        user.setPasswordHash(passwordEncoder.encode(temp));
        userRepository.save(user);
        return new ResetPasswordResponse(temp);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void adminSetPassword(UUID id, String newPassword) {
        var user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void changeOwnPassword(String email, String currentPassword, String newPassword) {
        var user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new BusinessException("Current password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void delete(UUID id) {
        var user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
    }

    // Utilidad por si quieres convertir a UserDto (igual que /auth/me)
    @Transactional(readOnly = true)
    public UserDto me(String email) {
        var user = userRepository.findByEmail(email).orElseThrow();
        return toDto(user);
    }
}
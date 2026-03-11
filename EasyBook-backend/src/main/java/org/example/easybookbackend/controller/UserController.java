package org.example.easybookbackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.easybookbackend.domain.dto.common.PageResponse;
import org.example.easybookbackend.domain.dto.user.*;
import org.example.easybookbackend.domain.dto.user.PasswordDtos.AdminSetPasswordRequest;
import org.example.easybookbackend.domain.dto.user.PasswordDtos.ChangePasswordRequest;
import org.example.easybookbackend.domain.enums.Role;
import org.example.easybookbackend.service.serviceImpl.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;

    // ---- ADMIN: CRUD ----
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDetailsDto> create(@RequestBody @Valid CreateUserRequest req) {
        return ResponseEntity.ok(userService.create(req));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<UserDetailsDto>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(userService.list(search, role, enabled, page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDetailsDto> get(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.get(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDetailsDto> update(@PathVariable UUID id, @RequestBody @Valid UpdateUserRequest req) {
        return ResponseEntity.ok(userService.update(id, req));
    }

    @PostMapping("/{id}/enable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> enable(@PathVariable UUID id) {
        userService.enable(id, true);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/disable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> disable(@PathVariable UUID id) {
        userService.enable(id, false);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResetPasswordResponse> resetPassword(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.resetPassword(id));
    }

    @PostMapping("/{id}/set-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> adminSetPassword(@PathVariable UUID id, @RequestBody @Valid AdminSetPasswordRequest req) {
        userService.adminSetPassword(id, req.newPassword());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ---- Usuario autenticado: cambiar su propia contraseña ----
    @PostMapping("/me/change-password")
    public ResponseEntity<Void> changeOwnPassword(@RequestBody @Valid ChangePasswordRequest req,
                                                  Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).build();
        }
        userService.changeOwnPassword(authentication.getName(), req.currentPassword(), req.newPassword());
        return ResponseEntity.noContent().build();
    }
}
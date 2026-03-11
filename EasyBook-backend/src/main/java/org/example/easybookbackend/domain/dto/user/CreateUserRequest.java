package org.example.easybookbackend.domain.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.example.easybookbackend.domain.enums.Role;

public record CreateUserRequest(
        @Email @NotBlank String email,
        @NotBlank @Size(min = 3, max = 120) String fullName,
        Role role,                           // por defecto GUEST si es null
        @Size(min = 6, max = 100) String password // opcional (si null -> temporal)
) {}
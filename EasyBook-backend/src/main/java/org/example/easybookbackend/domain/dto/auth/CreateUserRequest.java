package org.example.easybookbackend.domain.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.example.easybookbackend.domain.enums.Role;

public record CreateUserRequest(
        @Email @NotBlank String email,
        @NotBlank @Size(min = 3, max = 120) String fullName,
        Role role, // ADMIN crea STAFF o GUEST (o ADMIN si quieres permitirlo)
        @Size(min = 6, max = 100) String password // opcional; si viene vacío, generamos una temporal
) {}
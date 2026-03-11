package org.example.easybookbackend.domain.dto.user.PasswordDtos;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminSetPasswordRequest(
        @NotBlank @Size(min = 6, max = 100) String newPassword
) {}
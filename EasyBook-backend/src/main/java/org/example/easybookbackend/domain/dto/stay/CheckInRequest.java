package org.example.easybookbackend.domain.dto.stay;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CheckInRequest(
        @NotBlank String roomNumber,
        @Email @NotBlank String guestEmail,
        @NotBlank String guestFullName
) {}
package org.example.easybookbackend.domain.dto.stay;

import jakarta.validation.constraints.NotBlank;

public record CheckOutRequest(@NotBlank String roomNumber, String assignedStaffEmail) {}
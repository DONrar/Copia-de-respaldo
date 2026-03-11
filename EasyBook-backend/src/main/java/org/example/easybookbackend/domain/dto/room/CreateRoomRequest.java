package org.example.easybookbackend.domain.dto.room;

import jakarta.validation.constraints.NotBlank;

public record CreateRoomRequest(@NotBlank String number, @NotBlank String type) {}
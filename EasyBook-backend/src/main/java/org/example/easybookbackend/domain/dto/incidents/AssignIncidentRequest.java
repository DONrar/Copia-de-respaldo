package org.example.easybookbackend.domain.dto.incidents;

import jakarta.validation.constraints.NotBlank;

public record AssignIncidentRequest(@NotBlank String staffEmail) {}
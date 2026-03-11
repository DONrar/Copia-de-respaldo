package org.example.easybookbackend.domain.dto.inventory;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CreateInventoryItemRequest(@NotBlank String name, @Min(0) Integer quantity, @NotBlank String unit) {}
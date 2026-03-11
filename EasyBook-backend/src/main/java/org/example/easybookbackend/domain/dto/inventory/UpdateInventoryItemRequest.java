package org.example.easybookbackend.domain.dto.inventory;

import jakarta.validation.constraints.Min;

public record UpdateInventoryItemRequest(@Min(0) Integer quantity, String unit) {}
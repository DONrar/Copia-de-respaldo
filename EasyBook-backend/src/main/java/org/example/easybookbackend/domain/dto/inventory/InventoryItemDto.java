package org.example.easybookbackend.domain.dto.inventory;

import java.util.UUID;

public record InventoryItemDto(UUID id, String name, Integer quantity, String unit) {}
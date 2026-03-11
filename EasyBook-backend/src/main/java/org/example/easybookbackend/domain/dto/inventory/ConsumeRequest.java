package org.example.easybookbackend.domain.dto.inventory;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record ConsumeRequest(List<ItemQty> items) {
    public static record ItemQty(@NotBlank String name, @Min(1) int quantity) {}
}
package org.example.easybookbackend.domain.dto.incidents;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.util.List;


public record ResolveIncidentRequest(@Valid List<ItemQty> consumption) {
    public static record ItemQty(@NotBlank String name, @Min(1) int quantity) {}
}
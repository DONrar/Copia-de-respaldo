package org.example.easybookbackend.service.serviceImpl;

import lombok.RequiredArgsConstructor;
import org.example.easybookbackend.domain.dto.inventory.CreateInventoryItemRequest;
import org.example.easybookbackend.domain.dto.inventory.InventoryItemDto;
import org.example.easybookbackend.domain.dto.inventory.UpdateInventoryItemRequest;
import org.example.easybookbackend.domain.entity.InventoryItem;
import org.example.easybookbackend.domain.exception.BusinessException;
import org.example.easybookbackend.domain.exception.ResourceNotFoundException;
import org.example.easybookbackend.repository.InventoryItemRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryItemRepository inventoryItemRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public InventoryItemDto create(CreateInventoryItemRequest req) {
        inventoryItemRepository.findByNameIgnoreCase(req.name()).ifPresent(i -> {
            throw new BusinessException("Inventory item already exists: " + req.name());
        });
        var item = InventoryItem.builder()
                .name(req.name())
                .quantity(req.quantity() != null ? req.quantity() : 0)
                .unit(req.unit())
                .build();
        item = inventoryItemRepository.save(item);
        return toDto(item);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @Transactional(readOnly = true)
    public List<InventoryItemDto> listAll() {
        return inventoryItemRepository.findAll().stream().map(this::toDto).toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public InventoryItemDto update(UUID id, UpdateInventoryItemRequest req) {
        var item = inventoryItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));
        if (req.quantity() != null) item.setQuantity(req.quantity());
        if (req.unit() != null) item.setUnit(req.unit());
        return toDto(inventoryItemRepository.save(item));
    }

    /** Estructura interna para consumir desde otros servicios */
    public record Consume(String name, int quantity) {}

    /** Consumir lista de productos (para resoluciones de limpieza, etc.) */
    @Transactional
    public void consume(List<Consume> items) {
        for (var i : items) {
            var item = inventoryItemRepository.findByNameIgnoreCase(i.name())
                    .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found: " + i.name()));
            if (i.quantity() <= 0) continue;
            if (item.getQuantity() < i.quantity()) {
                throw new BusinessException("Insufficient stock for: " + i.name());
            }
            item.setQuantity(item.getQuantity() - i.quantity());
            inventoryItemRepository.save(item);
        }
    }

    private InventoryItemDto toDto(InventoryItem i) {
        return new InventoryItemDto(i.getId(), i.getName(), i.getQuantity(), i.getUnit());
    }
}
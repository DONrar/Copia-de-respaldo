package org.example.easybookbackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.easybookbackend.domain.dto.inventory.ConsumeRequest;
import org.example.easybookbackend.domain.dto.inventory.CreateInventoryItemRequest;
import org.example.easybookbackend.domain.dto.inventory.InventoryItemDto;
import org.example.easybookbackend.domain.dto.inventory.UpdateInventoryItemRequest;
import org.example.easybookbackend.service.serviceImpl.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<InventoryItemDto> create(@RequestBody CreateInventoryItemRequest req) {
        return ResponseEntity.ok(inventoryService.create(req));
    }

    @GetMapping
    public ResponseEntity<List<InventoryItemDto>> list() {
        return ResponseEntity.ok(inventoryService.listAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryItemDto> update(@PathVariable UUID id, @RequestBody UpdateInventoryItemRequest req) {
        return ResponseEntity.ok(inventoryService.update(id, req));
    }

    @PostMapping("/consume")
    public ResponseEntity<Void> consume(@RequestBody ConsumeRequest req) {
        inventoryService.consume(req.items().stream()
                .map(i -> new InventoryService.Consume(i.name(), i.quantity()))
                .toList());
        return ResponseEntity.noContent().build();
    }
}
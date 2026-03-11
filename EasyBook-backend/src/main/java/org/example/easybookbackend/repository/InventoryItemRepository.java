package org.example.easybookbackend.repository;

import org.example.easybookbackend.domain.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, UUID> {
    Optional<InventoryItem> findByNameIgnoreCase(String name);
}
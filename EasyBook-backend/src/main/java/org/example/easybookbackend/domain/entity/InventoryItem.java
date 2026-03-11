package org.example.easybookbackend.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity @Table(name = "inventory_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InventoryItem {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, unique = true, length = 120)
    private String name; // ej: "Shampoo 500ml"

    @Column(nullable = false)
    private Integer quantity; // stock total

    @Column(length = 20)
    private String unit; // ej: "unidad", "botella", "caja"
}
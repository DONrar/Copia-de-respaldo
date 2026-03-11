package org.example.easybookbackend.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.easybookbackend.domain.enums.RoomStatus;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity @Table(name = "rooms")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Room {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, unique = true, length = 20)
    private String number; // ej: "101", "B-203"

    @Column(length = 40)
    private String type;   // ej: "single", "double", "suite"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RoomStatus status = RoomStatus.AVAILABLE;
}
package org.example.easybookbackend.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "stays")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Stay {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Room room;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private User guest;

    @Column(nullable = false)
    private Instant checkInAt;

    private Instant checkOutAt;

    @Column(nullable = false)
    private boolean active;
}
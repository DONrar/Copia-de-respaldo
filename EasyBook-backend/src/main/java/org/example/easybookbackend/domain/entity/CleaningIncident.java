package org.example.easybookbackend.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.easybookbackend.domain.enums.IncidentStatus;
import org.hibernate.annotations.UuidGenerator;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity @Table(name = "cleaning_incidents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CleaningIncident {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY)
    private Stay stay; // opcional: referencia a la estancia que la originó

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IncidentStatus status = IncidentStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    private User assignedStaff; // role = STAFF

    @Column(nullable = false)
    private OffsetDateTime createdAt;

    private OffsetDateTime resolvedAt;
}
package org.example.easybookbackend.repository;

import org.example.easybookbackend.domain.entity.CleaningIncident;
import org.example.easybookbackend.domain.enums.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CleaningIncidentRepository extends JpaRepository<CleaningIncident, UUID> {
    List<CleaningIncident> findByStatusOrderByCreatedAtAsc(IncidentStatus status);
}
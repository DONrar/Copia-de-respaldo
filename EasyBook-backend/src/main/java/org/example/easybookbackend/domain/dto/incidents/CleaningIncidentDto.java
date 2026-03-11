package org.example.easybookbackend.domain.dto.incidents;

import org.example.easybookbackend.domain.enums.IncidentStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CleaningIncidentDto(UUID id, String roomNumber, IncidentStatus status,
                                  String assignedStaffEmail, OffsetDateTime createdAt, OffsetDateTime resolvedAt) {}

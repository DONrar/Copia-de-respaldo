package org.example.easybookbackend.domain.dto.stay;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.UUID;

public record StayDto(UUID id, String roomNumber, String guestEmail, String guestName,
                      Instant checkInAt, Instant checkOutAt, boolean active) {}
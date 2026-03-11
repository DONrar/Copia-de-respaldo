package org.example.easybookbackend.domain.dto.room;

import org.example.easybookbackend.domain.enums.RoomStatus;

import java.util.UUID;

public record RoomDto(UUID id, String number, String type, RoomStatus status) {}
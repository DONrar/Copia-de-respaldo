package org.example.easybookbackend.domain.dto.room;

import org.example.easybookbackend.domain.enums.RoomStatus;

public record UpdateRoomRequest(String type, RoomStatus status) {}
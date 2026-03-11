package org.example.easybookbackend.service.serviceImpl;

import lombok.RequiredArgsConstructor;
import org.example.easybookbackend.domain.dto.room.CreateRoomRequest;
import org.example.easybookbackend.domain.dto.room.RoomDto;
import org.example.easybookbackend.domain.dto.room.UpdateRoomRequest;
import org.example.easybookbackend.domain.entity.Room;
import org.example.easybookbackend.domain.enums.RoomStatus;
import org.example.easybookbackend.domain.exception.BusinessException;
import org.example.easybookbackend.domain.exception.ResourceNotFoundException;
import org.example.easybookbackend.repository.RoomRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public RoomDto create(CreateRoomRequest req) {
        roomRepository.findByNumber(req.number()).ifPresent(r -> {
            throw new BusinessException("Room number already exists: " + req.number());
        });
        var room = Room.builder()
                .number(req.number())
                .type(req.type())
                .status(RoomStatus.AVAILABLE)
                .build();
        room = roomRepository.save(room);
        return toDto(room);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF','GUEST')")
    @Transactional(readOnly = true)
    public List<RoomDto> listAll() {
        return roomRepository.findAll().stream().map(this::toDto).toList();
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF','GUEST')")
    @Transactional(readOnly = true)
    public RoomDto getByNumber(String number) {
        var room = roomRepository.findByNumber(number)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + number));
        return toDto(room);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public RoomDto update(String number, UpdateRoomRequest req) {
        var room = roomRepository.findByNumber(number)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + number));
        if (req.type() != null) room.setType(req.type());
        if (req.status() != null) room.setStatus(req.status());
        return toDto(roomRepository.save(room));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void delete(String number) {
        var room = roomRepository.findByNumber(number)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + number));
        roomRepository.delete(room);
    }

    private RoomDto toDto(Room r) {
        return new RoomDto(r.getId(), r.getNumber(), r.getType(), r.getStatus());
    }
}
package org.example.easybookbackend.service.serviceImpl;

import lombok.RequiredArgsConstructor;
import org.example.easybookbackend.domain.dto.stay.CheckInRequest;
import org.example.easybookbackend.domain.dto.stay.CheckOutRequest;
import org.example.easybookbackend.domain.dto.stay.StayDto;
import org.example.easybookbackend.domain.entity.Stay;
import org.example.easybookbackend.domain.entity.User;
import org.example.easybookbackend.domain.enums.Role;
import org.example.easybookbackend.domain.enums.RoomStatus;
import org.example.easybookbackend.domain.exception.BusinessException;
import org.example.easybookbackend.domain.exception.ResourceNotFoundException;
import org.example.easybookbackend.repository.RoomRepository;
import org.example.easybookbackend.repository.StayRepository;
import org.example.easybookbackend.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StayService {

    private final RoomRepository roomRepository;
    private final StayRepository stayRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CleaningIncidentService cleaningIncidentService;

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @Transactional
    public StayDto checkIn(CheckInRequest req) {
        var room = roomRepository.findByNumber(req.roomNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + req.roomNumber()));

        if (room.getStatus() != RoomStatus.AVAILABLE) {
            throw new BusinessException("Room is not available for check-in");
        }
        if (stayRepository.existsByRoomAndActive(room, true)) {
            throw new BusinessException("Room already has an active stay");
        }

        var guest = userRepository.findByEmail(req.guestEmail())
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .email(req.guestEmail())
                                .fullName(req.guestFullName())
                                .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                                .role(Role.GUEST)
                                .enabled(true)
                                .build()
                ));

        var stay = Stay.builder()
                .room(room)
                .guest(guest)
                .checkInAt(Instant.now())
                .active(true)
                .build();
        stay = stayRepository.save(stay);

        room.setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(room);

        return toDto(stay);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @Transactional
    public StayDto checkOut(CheckOutRequest req) {
        var room = roomRepository.findByNumber(req.roomNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + req.roomNumber()));

        var stay = stayRepository.findByRoomIdAndActive(room.getId(), true)
                .orElseThrow(() -> new BusinessException("No active stay for room"));

        stay.setActive(false);
        stay.setCheckOutAt(Instant.now());
        stayRepository.save(stay);

        // Al hacer check-out: habitación a DIRTY y crear incidencia de limpieza
        room.setStatus(RoomStatus.DIRTY);
        roomRepository.save(room);

        cleaningIncidentService.createFromCheckout(room, stay, req.assignedStaffEmail());

        return toDto(stay);
    }

    private StayDto toDto(Stay s) {
        return new StayDto(s.getId(), s.getRoom().getNumber(), s.getGuest().getEmail(),
                s.getGuest().getFullName(), s.getCheckInAt(), s.getCheckOutAt(), s.isActive());
    }
}
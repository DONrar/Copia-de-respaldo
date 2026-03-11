package org.example.easybookbackend.service.serviceImpl;

import lombok.RequiredArgsConstructor;
import org.example.easybookbackend.domain.dto.incidents.AssignIncidentRequest;
import org.example.easybookbackend.domain.dto.incidents.CleaningIncidentDto;
import org.example.easybookbackend.domain.dto.incidents.ResolveIncidentRequest;
import org.example.easybookbackend.domain.entity.CleaningIncident;
import org.example.easybookbackend.domain.entity.Room;
import org.example.easybookbackend.domain.entity.Stay;
import org.example.easybookbackend.domain.enums.IncidentStatus;
import org.example.easybookbackend.domain.enums.Role;
import org.example.easybookbackend.domain.enums.RoomStatus;
import org.example.easybookbackend.domain.exception.BusinessException;
import org.example.easybookbackend.domain.exception.ResourceNotFoundException;
import org.example.easybookbackend.repository.CleaningIncidentRepository;
import org.example.easybookbackend.repository.RoomRepository;
import org.example.easybookbackend.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CleaningIncidentService {

    private final CleaningIncidentRepository incidentRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final InventoryService inventoryService;

    @Transactional
    public CleaningIncidentDto createFromCheckout(Room room, Stay stay, String assignedStaffEmail) {
        var incident = CleaningIncident.builder()
                .room(room)
                .stay(stay)
                .status(IncidentStatus.PENDING)
                .createdAt(OffsetDateTime.now())
                .build();

        if (assignedStaffEmail != null && !assignedStaffEmail.isBlank()) {
            var staff = userRepository.findByEmail(assignedStaffEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + assignedStaffEmail));
            if (staff.getRole() != Role.STAFF && staff.getRole() != Role.ADMIN) {
                throw new BusinessException("Assigned user is not STAFF/ADMIN");
            }
            incident.setAssignedStaff(staff);
            incident.setStatus(IncidentStatus.IN_PROGRESS);
            room.setStatus(RoomStatus.CLEANING); // pasa a CLEANING cuando alguien la toma
            roomRepository.save(room);
        }

        incident = incidentRepository.save(incident);
        return toDto(incident);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @Transactional(readOnly = true)
    public List<CleaningIncidentDto> listByStatus(IncidentStatus status) {
        return incidentRepository.findByStatusOrderByCreatedAtAsc(status).stream().map(this::toDto).toList();
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @Transactional
    public CleaningIncidentDto assign(UUID incidentId, AssignIncidentRequest req) {
        var incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));
        var room = incident.getRoom();

        var staff = userRepository.findByEmail(req.staffEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + req.staffEmail()));
        if (staff.getRole() != Role.STAFF && staff.getRole() != Role.ADMIN) {
            throw new BusinessException("Assigned user is not STAFF/ADMIN");
        }
        incident.setAssignedStaff(staff);
        incident.setStatus(IncidentStatus.IN_PROGRESS);

        room.setStatus(RoomStatus.CLEANING);
        roomRepository.save(room);

        return toDto(incidentRepository.save(incident));
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @Transactional
    public CleaningIncidentDto resolve(UUID incidentId, ResolveIncidentRequest req) {
        var incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));
        var room = incident.getRoom();

        // consumo de inventario si se envió
        if (req != null && req.consumption() != null && !req.consumption().isEmpty()) {
            inventoryService.consume(req.consumption().stream()
                    .map(i -> new InventoryService.Consume(i.name(), i.quantity()))
                    .toList());
        }

        incident.setStatus(IncidentStatus.DONE);
        incident.setResolvedAt(OffsetDateTime.now());
        incidentRepository.save(incident);

        room.setStatus(RoomStatus.AVAILABLE);
        roomRepository.save(room);

        return toDto(incident);
    }

    private CleaningIncidentDto toDto(CleaningIncident i) {
        return new CleaningIncidentDto(
                i.getId(),
                i.getRoom().getNumber(),
                i.getStatus(),
                i.getAssignedStaff() != null ? i.getAssignedStaff().getEmail() : null,
                i.getCreatedAt(),
                i.getResolvedAt()
        );
    }
}
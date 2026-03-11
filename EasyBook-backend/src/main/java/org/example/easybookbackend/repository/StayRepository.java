package org.example.easybookbackend.repository;

import org.example.easybookbackend.domain.entity.Room;
import org.example.easybookbackend.domain.entity.Stay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StayRepository extends JpaRepository<Stay, UUID> {
    Optional<Stay> findByRoomIdAndActive(UUID roomId, boolean active);
    boolean existsByRoomAndActive(Room room, boolean active);
}
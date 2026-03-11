package org.example.easybookbackend.repository;

import org.example.easybookbackend.domain.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoomRepository extends JpaRepository<Room, UUID> {
    Optional<Room> findByNumber(String number);
}
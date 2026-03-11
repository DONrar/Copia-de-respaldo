package org.example.easybookbackend.domain.dto.user;

import org.example.easybookbackend.domain.enums.Role;

import java.util.UUID;

public record UserDetailsDto(UUID id, String email, String fullName, Role role, boolean enabled) {}

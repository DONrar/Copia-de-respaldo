package org.example.easybookbackend.domain.dto;

import org.example.easybookbackend.domain.enums.Role;

import java.util.UUID;

public record UserDto(UUID id, String email, String fullName, Role role, boolean enabled) {}

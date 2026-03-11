package org.example.easybookbackend.domain.dto.user;

import org.example.easybookbackend.domain.enums.Role;

public record UpdateUserRequest(
        String fullName,
        Role role,
        Boolean enabled
) {}
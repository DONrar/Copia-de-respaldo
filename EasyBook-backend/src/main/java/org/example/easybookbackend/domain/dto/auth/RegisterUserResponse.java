package org.example.easybookbackend.domain.dto.auth;


import org.example.easybookbackend.domain.dto.UserDto;

public record RegisterUserResponse(UserDto user, String temporaryPassword) {}
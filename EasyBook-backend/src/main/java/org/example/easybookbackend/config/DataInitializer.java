package org.example.easybookbackend.config;

import lombok.RequiredArgsConstructor;
import org.example.easybookbackend.domain.entity.User;
import org.example.easybookbackend.domain.enums.Role;
import org.example.easybookbackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initAdmin() {
        return args -> {
            String adminEmail = "admin@easybook.com";
            if (!userRepository.existsByEmail(adminEmail)) {
                var admin = User.builder()
                        .email(adminEmail)
                        .fullName("Super Admin")
                        .passwordHash(passwordEncoder.encode("Admin123!")) // cámbialo en cuanto arranque
                        .role(Role.ADMIN)
                        .enabled(true)
                        .build();
                userRepository.save(admin);
            }
        };
    }
}
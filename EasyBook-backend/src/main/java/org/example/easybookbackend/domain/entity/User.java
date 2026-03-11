package org.example.easybookbackend.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.easybookbackend.domain.entity.base.Auditable;
import org.example.easybookbackend.domain.enums.Role;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity @Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User extends Auditable {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false, length = 120)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    private boolean enabled = true;
}
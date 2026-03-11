package org.example.easybookbackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.easybookbackend.domain.dto.incidents.AssignIncidentRequest;
import org.example.easybookbackend.domain.dto.incidents.CleaningIncidentDto;
import org.example.easybookbackend.domain.dto.incidents.ResolveIncidentRequest;
import org.example.easybookbackend.domain.enums.IncidentStatus;
import org.example.easybookbackend.service.serviceImpl.CleaningIncidentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/incidents")
@RequiredArgsConstructor
public class CleaningIncidentController {

    private final CleaningIncidentService incidentService;

    @GetMapping
    public ResponseEntity<List<CleaningIncidentDto>> list(@RequestParam IncidentStatus status) {
        return ResponseEntity.ok(incidentService.listByStatus(status));
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<CleaningIncidentDto> assign(@PathVariable UUID id, @RequestBody AssignIncidentRequest req) {
        return ResponseEntity.ok(incidentService.assign(id, req));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<CleaningIncidentDto> resolve(@PathVariable UUID id, @RequestBody ResolveIncidentRequest req) {
        return ResponseEntity.ok(incidentService.resolve(id, req));
    }
}
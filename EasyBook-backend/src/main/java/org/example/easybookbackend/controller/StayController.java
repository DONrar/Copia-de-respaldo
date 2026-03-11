package org.example.easybookbackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.easybookbackend.domain.dto.stay.CheckInRequest;
import org.example.easybookbackend.domain.dto.stay.CheckOutRequest;
import org.example.easybookbackend.domain.dto.stay.StayDto;
import org.example.easybookbackend.service.serviceImpl.StayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stays")
@RequiredArgsConstructor
public class StayController {

    private final StayService stayService;

    @PostMapping("/check-in")
    public ResponseEntity<StayDto> checkIn(@RequestBody CheckInRequest req) {
        return ResponseEntity.ok(stayService.checkIn(req));
    }

    @PostMapping("/check-out")
    public ResponseEntity<StayDto> checkOut(@RequestBody CheckOutRequest req) {
        return ResponseEntity.ok(stayService.checkOut(req));
    }
}
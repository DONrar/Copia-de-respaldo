package org.example.easybookbackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.easybookbackend.domain.dto.room.CreateRoomRequest;
import org.example.easybookbackend.domain.dto.room.RoomDto;
import org.example.easybookbackend.domain.dto.room.UpdateRoomRequest;
import org.example.easybookbackend.service.serviceImpl.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomDto> create(@RequestBody CreateRoomRequest req) {
        return ResponseEntity.ok(roomService.create(req));
    }

    @GetMapping
    public ResponseEntity<List<RoomDto>> list() {
        return ResponseEntity.ok(roomService.listAll());
    }

    @GetMapping("/{number}")
    public ResponseEntity<RoomDto> get(@PathVariable String number) {
        return ResponseEntity.ok(roomService.getByNumber(number));
    }

    @PutMapping("/{number}")
    public ResponseEntity<RoomDto> update(@PathVariable String number, @RequestBody UpdateRoomRequest req) {
        return ResponseEntity.ok(roomService.update(number, req));
    }

    @DeleteMapping("/{number}")
    public ResponseEntity<Void> delete(@PathVariable String number) {
        roomService.delete(number);
        return ResponseEntity.noContent().build();
    }
}
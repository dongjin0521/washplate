package com.washplate.api;

import com.washplate.bay.*;
import com.washplate.session.*;
import com.washplate.vehicle.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/sessions")
public class SessionController {
    private final VehicleRepository vehicles;
    private final BayRepository bays;
    private final WashSessionRepository sessions;
    public SessionController(VehicleRepository vehicles, BayRepository bays, WashSessionRepository sessions) { this.vehicles = vehicles; this.bays = bays; this.sessions = sessions; }

    public record StartRequest(@NotBlank String plateNumber, @NotBlank String bayCode) {}

    @PostMapping("/start")
    public ResponseEntity<?> start(@RequestBody StartRequest req) {
        Vehicle vehicle = vehicles.findByPlateNumber(req.plateNumber()).orElseGet(() -> vehicles.save(new Vehicle(req.plateNumber(), null)));
        Bay bay = bays.findByCode(req.bayCode()).orElseGet(() -> bays.save(new Bay(req.bayCode())));
        sessions.findByBayAndStatus(bay, WashSessionStatus.ACTIVE).ifPresent(s -> { throw new IllegalStateException("Bay already in use"); });
        WashSession session = new WashSession();
        session.setVehicle(vehicle);
        session.setBay(bay);
        session = sessions.save(session);
        return ResponseEntity.ok(Map.of("sessionId", session.getId()));
    }

    public record SyncRequest(int minutes, double liters, int amount) {}
    @PostMapping("/{id}/sync")
    public ResponseEntity<?> sync(@PathVariable Long id, @RequestBody SyncRequest req) {
        WashSession session = sessions.findById(id).orElseThrow();
        session.syncUsage(req.minutes(), req.liters(), req.amount());
        sessions.save(session);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<?> close(@PathVariable Long id) {
        WashSession session = sessions.findById(id).orElseThrow();
        session.close(Instant.now());
        sessions.save(session);
        return ResponseEntity.ok(Map.of("charged", session.getChargeAmount()));
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActive(@RequestParam String plateNumber) {
        Vehicle vehicle = vehicles.findByPlateNumber(plateNumber).orElse(null);
        if (vehicle == null) return ResponseEntity.ok(Map.of("active", null));
        var opt = sessions.findByVehicleAndStatus(vehicle, WashSessionStatus.ACTIVE);
        return ResponseEntity.ok(Map.of(
                "active", opt.map(s -> Map.of(
                        "id", s.getId(),
                        "plateNumber", plateNumber,
                        "bayCode", s.getBay().getCode(),
                        "bayName", s.getBay().getName(),
                        "minutes", s.getUsedMinutes(),
                        "liters", s.getUsedLiters(),
                        "amount", s.getChargeAmount()
                )).orElse(null)
        ));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@RequestParam String plateNumber) {
        Vehicle vehicle = vehicles.findByPlateNumber(plateNumber).orElse(null);
        if (vehicle == null) return ResponseEntity.ok(List.of());
        List<Map<String, Object>> list = sessions.findAll().stream()
                .filter(s -> s.getVehicle().equals(vehicle) && s.getStatus() == WashSessionStatus.CLOSED)
                .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                .limit(20)
                .map(s -> {
                    java.util.Map<String, Object> m = new java.util.LinkedHashMap<>();
                    m.put("id", s.getId());
                    m.put("bayCode", s.getBay().getCode());
                    m.put("startedAt", s.getStartedAt());
                    m.put("endedAt", s.getEndedAt());
                    m.put("minutes", s.getUsedMinutes());
                    m.put("liters", s.getUsedLiters());
                    m.put("amount", s.getChargeAmount());
                    return m;
                })
                .toList();
        return ResponseEntity.ok(list);
    }
}



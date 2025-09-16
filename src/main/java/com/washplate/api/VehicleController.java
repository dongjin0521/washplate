package com.washplate.api;

import com.washplate.user.User;
import com.washplate.user.UserRepository;
import com.washplate.vehicle.Vehicle;
import com.washplate.vehicle.VehicleRepository;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {
    private final VehicleRepository vehicles;
    private final UserRepository users;
    public VehicleController(VehicleRepository vehicles, UserRepository users) { this.vehicles = vehicles; this.users = users; }

    @GetMapping
    public List<Vehicle> list(Authentication auth) {
        Long ownerId = extractUserId(auth);
        List<Vehicle> all = vehicles.findAll();
        return all.stream().filter(v -> v.getOwner() != null && v.getOwner().getId().equals(ownerId)).toList();
    }

    public record CreateRequest(@NotBlank String plateNumber, String nickname, Boolean isDefault) {}
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateRequest req, Authentication auth) {
        Long ownerId = extractUserId(auth);
        vehicles.findByPlateNumber(req.plateNumber()).ifPresent(v -> { throw new IllegalArgumentException("plate exists"); });
        Vehicle v = new Vehicle(req.plateNumber(), req.nickname());
        User owner = users.findById(ownerId).orElseThrow();
        v.setOwner(owner);
        if (req.isDefault() != null && req.isDefault()) {
            v.setDefault(true);
        }
        Vehicle saved = vehicles.save(v);
        return ResponseEntity.ok(Map.of("id", saved.getId()));
    }

    public record UpdateRequest(String nickname, Boolean isDefault) {}
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UpdateRequest req, Authentication auth) {
        Long ownerId = extractUserId(auth);
        Vehicle v = vehicles.findById(id).orElseThrow();
        if (v.getOwner() == null || !v.getOwner().getId().equals(ownerId)) { throw new IllegalArgumentException("forbidden"); }
        if (req.nickname() != null) v.setNickname(req.nickname());
        if (req.isDefault() != null) v.setDefault(req.isDefault());
        vehicles.save(v);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication auth) {
        Long ownerId = extractUserId(auth);
        Vehicle v = vehicles.findById(id).orElseThrow();
        if (v.getOwner() == null || !v.getOwner().getId().equals(ownerId)) { throw new IllegalArgumentException("forbidden"); }
        vehicles.delete(v);
        return ResponseEntity.noContent().build();
    }

    private Long extractUserId(Authentication auth) {
        if (auth == null || auth.getName() == null) throw new IllegalArgumentException("unauthorized");
        // principal username format: "{userId}:{phone}" from JwtAuthFilter
        String name = auth.getName();
        int idx = name.indexOf(":");
        String idPart = idx > 0 ? name.substring(0, idx) : name;
        return Long.parseLong(idPart);
    }
}



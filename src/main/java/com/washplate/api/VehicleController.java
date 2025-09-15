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

@RestController
@RequestMapping("/vehicles")
public class VehicleController {
    private final VehicleRepository vehicles;
    private final UserRepository users;
    public VehicleController(VehicleRepository vehicles, UserRepository users) { this.vehicles = vehicles; this.users = users; }

    @GetMapping
    public List<Vehicle> list(@RequestParam(required = false) Long ownerId) {
        List<Vehicle> all = vehicles.findAll();
        if (ownerId == null) return all;
        return all.stream().filter(v -> v.getOwner() != null && v.getOwner().getId().equals(ownerId)).toList();
    }

    public record CreateRequest(@NotBlank String plateNumber, String nickname, Long ownerId, Boolean isDefault) {}
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateRequest req) {
        vehicles.findByPlateNumber(req.plateNumber()).ifPresent(v -> { throw new IllegalArgumentException("plate exists"); });
        Vehicle v = new Vehicle(req.plateNumber(), req.nickname());
        if (req.ownerId() != null) {
            User owner = users.findById(req.ownerId()).orElseThrow();
            v.setOwner(owner);
        }
        if (req.isDefault() != null && req.isDefault()) {
            v.setDefault(true);
        }
        Vehicle saved = vehicles.save(v);
        return ResponseEntity.ok(Map.of("id", saved.getId()));
    }

    public record UpdateRequest(String nickname, Boolean isDefault) {}
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UpdateRequest req) {
        Vehicle v = vehicles.findById(id).orElseThrow();
        if (req.nickname() != null) v.setNickname(req.nickname());
        if (req.isDefault() != null) v.setDefault(req.isDefault());
        vehicles.save(v);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        vehicles.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}



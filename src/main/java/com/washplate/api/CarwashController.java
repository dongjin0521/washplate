package com.washplate.api;

import com.washplate.carwash.*;
import com.washplate.bay.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/carwashes")
public class CarwashController {
    private final CarwashRepository carwashes;
    private final BayRepository bays;

    public CarwashController(CarwashRepository carwashes, BayRepository bays) {
        this.carwashes = carwashes; this.bays = bays;
    }

    @GetMapping
    public List<Carwash> list() { return carwashes.findAll(); }

    public record CreateRequest(@NotBlank String code, @NotBlank String name, String address) {}
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateRequest req) {
        carwashes.findByCode(req.code()).ifPresent(c -> { throw new IllegalArgumentException("code exists"); });
        Carwash c = new Carwash(req.code(), req.name(), req.address());
        Carwash saved = carwashes.save(c);
        return ResponseEntity.ok(Map.of("id", saved.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        carwashes.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    public record UpdateRequest(String name, String address, Boolean active) {}
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UpdateRequest req) {
        Carwash c = carwashes.findById(id).orElseThrow();
        if (req.name() != null) c.setName(req.name());
        if (req.address() != null) c.setAddress(req.address());
        if (req.active() != null) c.setActive(req.active());
        carwashes.save(c);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // Bays under a carwash
    @GetMapping("/{id}/bays")
    public List<Bay> listBays(@PathVariable Long id) {
        Carwash c = carwashes.findById(id).orElseThrow();
        return bays.findByCarwash(c);
    }

    public record CreateBayRequest(@NotBlank String code, String name, Boolean active) {}
    @PostMapping("/{id}/bays")
    public ResponseEntity<?> createBay(@PathVariable Long id, @RequestBody CreateBayRequest req) {
        Carwash c = carwashes.findById(id).orElseThrow();
        bays.findByCode(req.code()).ifPresent(b -> { throw new IllegalArgumentException("bay exists"); });
        Bay b = new Bay(req.code());
        b.setCarwash(c);
        if (req.name() != null) {
            try { var f = Bay.class.getDeclaredField("name"); f.setAccessible(true); f.set(b, req.name()); } catch (Exception ignored) {}
        }
        if (req.active() != null && !req.active()) {
            try { var f = Bay.class.getDeclaredField("active"); f.setAccessible(true); f.set(b, false); } catch (Exception ignored) {}
        }
        Bay saved = bays.save(b);
        return ResponseEntity.ok(Map.of("id", saved.getId()));
    }

    @DeleteMapping("/{id}/bays/{bayId}")
    public ResponseEntity<?> deleteBay(@PathVariable Long id, @PathVariable Long bayId) {
        Bay b = bays.findById(bayId).orElseThrow();
        bays.delete(b);
        return ResponseEntity.noContent().build();
    }

    public record UpdateBayRequest(String name, Boolean active) {}
    @PutMapping("/{id}/bays/{bayId}")
    public ResponseEntity<?> updateBay(@PathVariable Long id, @PathVariable Long bayId, @RequestBody UpdateBayRequest req) {
        Bay b = bays.findById(bayId).orElseThrow();
        if (req.name() != null) {
            try { var f = Bay.class.getDeclaredField("name"); f.setAccessible(true); f.set(b, req.name()); } catch (Exception ignored) {}
        }
        if (req.active() != null) {
            try { var f = Bay.class.getDeclaredField("active"); f.setAccessible(true); f.set(b, req.active()); } catch (Exception ignored) {}
        }
        bays.save(b);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}



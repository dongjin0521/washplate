package com.washplate.api;

import com.washplate.paymentmethod.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payment-methods")
public class PaymentMethodController {
    private final PaymentMethodRepository repo;
    public PaymentMethodController(PaymentMethodRepository repo) { this.repo = repo; }

    @GetMapping
    public List<PaymentMethod> list() { return repo.findAll(); }

    public record CreateRequest(@NotBlank String type, @NotBlank String label, @NotBlank String maskedNumber) {}
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateRequest req) {
        PaymentMethodType t = PaymentMethodType.valueOf(req.type().toUpperCase());
        PaymentMethod saved = repo.save(new PaymentMethod(t, req.label(), req.maskedNumber()));
        return ResponseEntity.ok(Map.of("id", saved.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}



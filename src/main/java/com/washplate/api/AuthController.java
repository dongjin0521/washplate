package com.washplate.api;

import com.washplate.user.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserRepository users;
    public AuthController(UserRepository users) { this.users = users; }
    public record LoginRequest(@NotBlank String phone, String name) {}
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User user = users.findByPhone(req.phone()).orElseGet(() -> users.save(new User(req.phone(), req.name() == null ? "사용자" : req.name(), UserRole.CUSTOMER)));
        return ResponseEntity.ok(Map.of("userId", user.getId(), "role", user.getRole(), "phone", user.getPhone(), "name", user.getName()));
    }
}



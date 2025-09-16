package com.washplate.api;

import com.washplate.user.*;
import com.washplate.security.JwtUtil;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserRepository users;
    private final JwtUtil jwtUtil = new JwtUtil("washplate-demo-secret-key-should-be-long-32-bytes", 1000L * 60 * 60 * 24 * 7);
    public AuthController(UserRepository users) { this.users = users; }
    public record LoginRequest(@NotBlank String phone, String name) {}
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User user = users.findByPhone(req.phone()).orElseGet(() -> users.save(new User(req.phone(), req.name() == null ? "사용자" : req.name(), UserRole.CUSTOMER)));
        String token = jwtUtil.generateToken(Map.of(
                "userId", user.getId(),
                "phone", user.getPhone(),
                "name", user.getName(),
                "role", user.getRole().name()
        ));
        return ResponseEntity.ok(Map.of(
                "token", token,
                "userId", user.getId(),
                "role", user.getRole(),
                "phone", user.getPhone(),
                "name", user.getName()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Stateless JWT: 클라이언트 측 토큰 폐기만으로 처리. 필요 시 블랙리스트 저장 구현.
        return ResponseEntity.ok(Map.of("ok", true));
    }
}



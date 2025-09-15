package com.washplate.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/device")
public class DeviceController {
    @PostMapping("/allow-water")
    public ResponseEntity<?> allowWater(@RequestParam String bayCode, @RequestParam boolean allow) {
        return ResponseEntity.ok(Map.of("bayCode", bayCode, "allow", allow));
    }
}



package com.washplate.carwash;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarwashRepository extends JpaRepository<Carwash, Long> {
    Optional<Carwash> findByCode(String code);
}



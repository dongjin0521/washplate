package com.washplate.bay;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BayRepository extends JpaRepository<Bay, Long> {
    Optional<Bay> findByCode(String code);
}



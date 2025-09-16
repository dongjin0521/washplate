package com.washplate.bay;

import com.washplate.carwash.Carwash;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BayRepository extends JpaRepository<Bay, Long> {
    Optional<Bay> findByCode(String code);
    List<Bay> findByCarwash(Carwash carwash);
}



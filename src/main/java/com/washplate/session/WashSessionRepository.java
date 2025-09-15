package com.washplate.session;

import com.washplate.bay.Bay;
import com.washplate.vehicle.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WashSessionRepository extends JpaRepository<WashSession, Long> {
    Optional<WashSession> findByVehicleAndStatus(Vehicle vehicle, WashSessionStatus status);
    Optional<WashSession> findByBayAndStatus(Bay bay, WashSessionStatus status);
}



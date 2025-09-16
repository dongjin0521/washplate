package com.washplate.session;

import com.washplate.bay.Bay;
import com.washplate.common.model.BaseEntity;
import com.washplate.vehicle.Vehicle;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "wash_sessions")
public class WashSession extends BaseEntity {
    @ManyToOne(optional = false)
    private Vehicle vehicle;

    @ManyToOne(optional = false)
    private Bay bay;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private WashSessionStatus status = WashSessionStatus.ACTIVE;

    @Column(nullable = false)
    private Instant startedAt = Instant.now();

    private Instant endedAt;

    @Column(nullable = false)
    private int usedMinutes = 0;
    @Column(nullable = false)
    private double usedLiters = 0.0;
    @Column(nullable = false)
    private int chargeAmount = 0;

    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
    public void setBay(Bay bay) { this.bay = bay; }
    public Bay getBay() { return bay; }
    public void syncUsage(int minutes, double liters, int amount) { this.usedMinutes = minutes; this.usedLiters = liters; this.chargeAmount = amount; }
    public void close(Instant endedAt) { this.status = WashSessionStatus.CLOSED; this.endedAt = endedAt; }
}



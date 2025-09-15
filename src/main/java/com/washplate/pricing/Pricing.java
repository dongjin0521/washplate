package com.washplate.pricing;

import com.washplate.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "pricing")
public class Pricing extends BaseEntity {
    @Column(nullable = false)
    private int pricePerMinute;

    @Column(nullable = false)
    private int pricePerLiter;

    public Pricing(int pricePerMinute, int pricePerLiter) {
        this.pricePerMinute = pricePerMinute;
        this.pricePerLiter = pricePerLiter;
    }
}



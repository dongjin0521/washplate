package com.washplate.payment;

import com.washplate.common.model.BaseEntity;
import com.washplate.session.WashSession;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "payments")
public class Payment extends BaseEntity {
    @ManyToOne(optional = false)
    private WashSession session;

    @Column(nullable = false)
    private int amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;

    public Payment(WashSession session, int amount) {
        this.session = session;
        this.amount = amount;
    }

    public void success() { this.status = PaymentStatus.SUCCESS; }
    public void fail() { this.status = PaymentStatus.FAILED; }
}



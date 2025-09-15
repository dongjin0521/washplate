package com.washplate.paymentmethod;

import com.washplate.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "payment_methods")
public class PaymentMethod extends BaseEntity {
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethodType type; // CARD, ACCOUNT 등 확장 여지

    @Column(nullable = false)
    private String label; // 예: KB 0772

    @Column(nullable = false)
    private String maskedNumber; // ****-****-****-0772

    public PaymentMethod(PaymentMethodType type, String label, String maskedNumber) {
        this.type = type;
        this.label = label;
        this.maskedNumber = maskedNumber;
    }
}



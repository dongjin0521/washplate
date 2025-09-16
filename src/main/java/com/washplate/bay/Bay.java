package com.washplate.bay;

import com.washplate.carwash.Carwash;
import com.washplate.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "bays")
public class Bay extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private boolean active = true;

    // 지점/위치 표시용 선택 필드
    @Column
    private String name;

    @ManyToOne(optional = false)
    private Carwash carwash;

    public Bay(String code) { this.code = code; }
    public String getName() { return name; }
    public void setCarwash(Carwash carwash) { this.carwash = carwash; }
}



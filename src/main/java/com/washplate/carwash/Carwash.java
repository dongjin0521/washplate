package com.washplate.carwash;

import com.washplate.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "carwashes")
public class Carwash extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String code; // 예: CW-001

    @Column(nullable = false)
    private String name; // 예: 강남점

    @Column
    private String address;

    @Column(nullable = false)
    private boolean active = true;

    public Carwash(String code, String name, String address) {
        this.code = code;
        this.name = name;
        this.address = address;
    }

    public void setName(String name) { this.name = name; }
    public void setAddress(String address) { this.address = address; }
    public void setActive(boolean active) { this.active = active; }
}



package com.washplate.vehicle;

import com.washplate.common.model.BaseEntity;
import com.washplate.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "vehicles")
public class Vehicle extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String plateNumber;

    @Column
    private String nickname;

    @ManyToOne(optional = true)
    private User owner;

    @Column(nullable = false)
    private boolean isDefault = false;

    public Vehicle(String plateNumber, String nickname) {
        this.plateNumber = plateNumber;
        this.nickname = nickname;
    }

    public void setNickname(String nickname) { this.nickname = nickname; }
    public void setOwner(User owner) { this.owner = owner; }
    public void setDefault(boolean aDefault) { isDefault = aDefault; }
    public boolean getIsDefault() { return isDefault; }
}



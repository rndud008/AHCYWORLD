package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class EmailAuthentication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;
    private String authenticationCode;
    private String status;
    private LocalDateTime createAt;

    @PrePersist
    @PreUpdate
    public void prePersistAndUpdate(){
        this.createAt = LocalDateTime.now().plusMinutes(3l);
    }
}

package com.lec.spring.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(callSuper = false)
@Table(
        uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "item_id"})}
)
@Entity
public class Carts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Item item;

    @Column(nullable = false)
    private String cartsStatus;



    // 결제날짜는 BaseEntity에 있음
    @LastModifiedDate
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    @Column(updatable = true)
    private LocalDateTime createAt;

    @PrePersist
    public void prePersistAndUpdate() {
        this.createAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.createAt = LocalDateTime.now();
    }
}

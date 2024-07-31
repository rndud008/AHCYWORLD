package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Table(
    uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id","item_id"})}
)
@Entity
public class Carts extends BaseEntity{
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
}

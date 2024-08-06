package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
public class PaymentHistory extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;          // 유저 아이디

    @ManyToOne
    @JoinColumn(name = "friend_user_id")
    private User friendUser;    // 친구 아이디(null 허용)

    @Column(nullable = false)
    private String merchantUid;     // 결제번호
    @Column(nullable = false)
    private String impUid;          // 주문고유번호

    @Column(nullable = false)
    private int payment;           // 결제금액

    @Column(nullable = false)
    private int acornCnt;          // 도토리 개수
}

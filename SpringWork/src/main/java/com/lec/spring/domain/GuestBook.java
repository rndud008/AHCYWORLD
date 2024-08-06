package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Entity
public class GuestBook extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Hompy hompy;

    @Column(nullable = false)
    private String guestBookName;       // 방명록 종류(state로 방명록, 일촌평 구분)

    @Column(nullable = false)
    private String content;
    // 작성일은 베이스엔티티
    @ColumnDefault(value = "'visible'")
    @Column(insertable = false)
    private String status;      // 기본은 show 상태 (show, hidden) : 일촌관계에 따라 보여주는 상태 변경.
}

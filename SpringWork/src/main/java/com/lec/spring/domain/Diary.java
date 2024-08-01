package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Builder
@Entity
public class Diary extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private Hompy hompy;

    @Column(nullable = false)
    private LocalDate eventDate;
    // 작성날짜는 베이스 엔티티

    @Column(nullable = false)
    private String keyWord;

    private String content;
}

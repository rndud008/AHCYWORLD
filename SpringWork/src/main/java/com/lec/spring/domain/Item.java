package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String itemName;    // 상품이름, 가수-노래제목

    @Column(nullable = false)
    private String itemType;    // 상품타입

    @Column(nullable = false)
    private String sourceName;  // 원본명(이미지), 노래 이미지

    @Column(nullable = false)
    private String fileName;    // 저장명, 노래 링크

    @ColumnDefault(value = "0")
    private Long price;         // 도토리 가격

    @ColumnDefault(value = "'visible'")
    private String status;      // 상품 'show','hidden' 상태

    private String bgmImg;      // 노래 이미지
}

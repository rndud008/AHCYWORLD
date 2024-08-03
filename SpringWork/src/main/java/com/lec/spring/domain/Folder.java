package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity(name = "folder")
public class Folder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private BoardType boardType ;

    @Column(nullable = false)
    private String name;        // 폴더 이름

    @ManyToOne(optional = false)
    private Hompy hompy;

    @ColumnDefault(value = "'전체공개'")
    private String status; // 폴더 공개범위 (전체공개, 일촌공개, 비공개)

}

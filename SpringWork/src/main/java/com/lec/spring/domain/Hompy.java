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
@Entity
public class Hompy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User user;

    private String profilePicture;

    private String statusMessage;

    @Column(nullable = false)
    private String title;

    @ColumnDefault(value = "0")
    private Long todayVisitor;

    @ColumnDefault(value = "0")
    private Long totalVisitor;

    private String profile;

    private String menuColor; // 배경, 글자, 테두리 설정.

    private String menuStatus;  // 게시판, 사진첩, 동영상, 방명록 (show, hidden 설정.)

}

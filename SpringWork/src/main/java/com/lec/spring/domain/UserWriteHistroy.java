package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.java.Log;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class UserWriteHistroy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Hompy hompy;

    private String username;

    private String subject;

    private String content;

    private LocalDateTime createAt; // 해당글의 작성일
    private LocalDateTime updateAt; // 해당글의 수정일?

    private String status; // Insert, Update, Delete 세가지 상태로 구분.


}

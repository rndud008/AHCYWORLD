package com.lec.spring.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Builder
@Entity(name = "ah_user")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, updatable = false)
    private String username;        // 로그인 아이디

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Column(nullable = false, updatable = false)
    private String name;

    @Column(unique = true)
    private String email;

    @Column(updatable = false, nullable = true)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate birthDay;

    @Column(nullable = true)
    private String gender;

    @ColumnDefault(value = "0")
    @Column(insertable = false)
    private Long acorn;         // 도토리

    @Column(updatable = false)
    private String role;        // 기본은 member
}
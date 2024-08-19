package com.lec.spring.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lec.spring.listener.WriteEntityListener;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Entity
@EntityListeners(WriteEntityListener.class)
public class Comment extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
//    @ToString.Exclude
    private User user;

    @ManyToOne(optional = false)
//    @JsonIgnore
    private Post post;

    @Column(nullable = false)
    private String content;
    // 작성날짜는 베이스 엔티티
}

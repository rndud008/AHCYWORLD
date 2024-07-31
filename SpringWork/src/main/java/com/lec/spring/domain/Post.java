package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Builder
@Entity
public class Post extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "post_id")
    private List<Attachment> attachment = new ArrayList<>();

    @ManyToOne
    private Folder folder;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String content;

    private Long viewCnt;
    // 작성일은 BaseEntity
}

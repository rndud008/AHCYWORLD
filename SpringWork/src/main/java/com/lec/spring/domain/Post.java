package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

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

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "post_id")
    private List<Attachment> ImageList = new ArrayList<>();

    @ManyToOne
    private Folder folder;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String content;

    @Column(insertable = false)
    @ColumnDefault(value = "0")
    private Long viewCnt;

    // 작성일은 BaseEntity
}

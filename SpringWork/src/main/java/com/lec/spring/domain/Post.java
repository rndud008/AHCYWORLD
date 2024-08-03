package com.lec.spring.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "post_id")
//    @JsonIgnore
    private List<Attachment> ImageList = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "post_id")
    @JsonIgnore
    private List<Comment> comments = new ArrayList<>();

    @ManyToOne(optional = false)
    private Folder folder;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String content;

    @Column(insertable = false)
    @ColumnDefault(value = "0")
    private Long viewCnt;

    @Column(insertable = false)
    @ColumnDefault(value = "0")
    private Long scrap;

    // 작성일은 BaseEntity
}

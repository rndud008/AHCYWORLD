package com.lec.spring.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lec.spring.listener.WriteEntityListener;
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
@EntityListeners(WriteEntityListener.class)
public class Post extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 가짜 맵핑..
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    @Builder.Default // builder 제공안함.
    @ToString.Exclude
    private List<Attachment> fileList = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    @Builder.Default // builder 제공안함.
    @JsonIgnore
    private List<Comment> comments = new ArrayList<>();

    @ManyToOne(optional = false)
    @JoinColumn(name = "folder_id")
    @ToString.Exclude
    private Folder folder;

    @Column(nullable = false)
    private String subject;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @Column(insertable = false)
    @ColumnDefault(value = "0")
    private Long viewCnt;

    @Column(insertable = false)
    @ColumnDefault(value = "0")
    private Long scrap;

    @Transient
    private boolean updateViews = true;

    // 작성일은 BaseEntity


}

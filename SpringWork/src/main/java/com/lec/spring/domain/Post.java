package com.lec.spring.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;
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

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    @Builder.Default // builder 제공안함.

    @ToString.Exclude
    private List<Attachment> fileList = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    @Builder.Default // builder 제공안함.
    private List<Comment> comments = new ArrayList<>();

    @ManyToOne(optional = false)
    @JoinColumn(name = "folder_id")
//    @JsonManagedReference
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

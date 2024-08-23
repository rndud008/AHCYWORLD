package com.lec.spring.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity(name = "folder")
@JsonIgnoreProperties(ignoreUnknown = true)
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

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Post> posts;

    public void baseFolder(Hompy hompy,BoardType boardType){
        name = boardType.getName()+" 기본폴더";
        this.hompy = hompy;
        status = "전체공개";
        this.boardType = boardType;
    }
}

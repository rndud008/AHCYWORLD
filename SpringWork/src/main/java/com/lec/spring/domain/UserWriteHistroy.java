package com.lec.spring.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lec.spring.support.AttachmentListConverter;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.java.Log;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Builder
@Entity
public class UserWriteHistroy extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Hompy hompy;

    private String username;

    private String postType;

    private String subject;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String content;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    @Convert(converter = AttachmentListConverter.class)
    @ToString.Exclude
    private List<Attachment> attachmentList = new ArrayList<>();

    private String status; // Insert, Update, Delete 세가지 상태로 구분.

    // 생성일은 BaseEntity

}

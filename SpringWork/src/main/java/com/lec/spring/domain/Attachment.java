package com.lec.spring.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.lec.spring.listener.WriteEntityListener;
import jakarta.persistence.*;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    private Post post;

    private String sourceName;
    private String fileName;

    @Transient
    private boolean isImage;
    @Transient
    private boolean isVideo;
}

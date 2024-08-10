package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Hompy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User user;

    private String profilePicture;

    private String statusMessage;

    @Column(nullable = false)
    private String title;

    @ColumnDefault(value = "0")
    @Column(insertable = false)
    private Long todayVisitor;

    @ColumnDefault(value = "0")
    @Column(insertable = false)
    private Long totalVisitor;

    private String minimiPicture; // 미니미
    private String miniRoom; // 미니룸
    private String miniHompySkin; // 미니홈피 스킨

    private String profile;

    private String menuColor; // 배경, 글자, 테두리 설정.
    private String menuStatus;  // 게시판, 사진첩, 동영상, 방명록 (visible, invisible 설정.)


    // 미니룸, 미니미, 미니홈피 스킨 기본이미지 설정 ( 미니미는 성별이 남자면 남자이미지 / 여자면 여자이미지), 프로필 기본이미지
    @PrePersist
    public void prePersist() {
        // 프로필 기본이미지
        if (this.profilePicture == null) {
            this.profilePicture = "/upload/default_profile.png";
        }

        //        // 미니미 기본이미지
//        if (this.minimiPicture == null) {
//            if (user != null && "MALE".equalsIgnoreCase(user.getGender())) {
//                this.minimiPicture = "upload/male.png"; // 성별이 남자일때 미니미
//            } else {
//                this.minimiPicture = "upload/female.png"; // 성별이 여자일때 미니미
//            }
//        }
//
//        // 미니룸 기본이미지
//        if (this.miniRoom == null) {
//            this.miniRoom = "/upload/miniroom.png";
//        }
//
//        // 미니홈피 스킨 기본이미지
//        if (this.miniHompySkin == null) {
//            this.miniHompySkin = "/upload/mainskin.png";
//        }
    }
}

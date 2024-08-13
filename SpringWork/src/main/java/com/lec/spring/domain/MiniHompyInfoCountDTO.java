package com.lec.spring.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MiniHompyInfoCountDTO {
    private Long todayBoard;
    private Long totalBoard;

    private Long todayPhoto;
    private Long totalPhoto;

    private Long todayVideo;
    private Long totalVideo;

    private Long todayGuestBook;
    private Long totalGuestBook;

    private Long todayDiary;
    private Long totalDiary;


}

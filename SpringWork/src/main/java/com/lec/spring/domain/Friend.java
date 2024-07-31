package com.lec.spring.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Friend {
    private User user;
    private User friendUser;
    private String friendName;      // 일촌 친구 별명
    private String userName;      // 일촌 user 별명.
    private String message;

    private String friendStatus;
}

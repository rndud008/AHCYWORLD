package com.lec.spring.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QryResult {

    Integer count; // 결과값

    Long postId;

    String status; // 처리결과 메시지
}

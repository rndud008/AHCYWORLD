package com.lec.spring.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pagenation {
    private Long cnt;
    private int totalPage;
    private int writepages;
    private int pagerows;
    private int page;
    private int startpage;
    private int endpage;
    private String url;
    private List<Post> posts;
    private List<Item> items;
}

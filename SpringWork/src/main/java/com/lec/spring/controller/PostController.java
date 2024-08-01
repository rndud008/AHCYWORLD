package com.lec.spring.controller;

import com.lec.spring.domain.Post;
import com.lec.spring.service.PostService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // 작성
    @PostMapping("/{hompyId}/write")
    public ResponseEntity<?> write(@PathVariable Long hompyId
            , @RequestBody Post post
            , HttpServletRequest request){

        String authorization  = request.getHeader("Authorization");
        if(authorization == null || !authorization.startsWith("Bearer")){
            return null;
        }

        String token = authorization.split(" ")[1];







        return null;
    }

    // 수정

    // 삭제

    // 조회

    // list?
}

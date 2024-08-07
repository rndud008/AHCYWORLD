package com.lec.spring.controller;

import com.lec.spring.domain.*;
import com.lec.spring.jwt.JWTUtil;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.service.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping
public class FolderController {

    private final FolderService folderService;
    private final UserService userService;
    private final JWTUtil jwtUtil;
    private final HompyService hompyService;
    private final BoardTypeService boardTypeService;
    private final FriendService friendService;

    public FolderController(FolderService folderService, UserService userService, JWTUtil jwtUtil, HompyService hompyService, BoardTypeService boardTypeService, FriendService friendService) {
        this.folderService = folderService;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.hompyService = hompyService;
        this.boardTypeService = boardTypeService;
        this.friendService = friendService;
    }

    public Hompy check(HttpServletRequest request) {

        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer")) {
            return null;
        }

        String token = authorization.split(" ")[1];

        if (jwtUtil.isExpired(token)) {
            return null;
        }

        Long id = jwtUtil.getId(token);

        User user = userService.findByUserId(id).orElse(null);

        if (user == null) {
            return null;
        }

        return hompyService.findHompyByuser(user);
    }

    public String boardTypeName(String boardtype) {
        if (boardtype.equals("board")) {
            return "게시판";
        }

        if (boardtype.equals("photo")) {
            return "사진첩";
        }

        if (boardtype.equals("video")) {
            return "동영상";
        }

        return "";
    }

    private ResponseEntity<?> validateRequest(Folder folder, Hompy hompy, BoardType boardType, Long hompyId, Hompy miniHompy) {
        if (folder != null) {
            boolean nameCheck = !folder.getName().trim().isEmpty();
            if (!nameCheck) {
                return new ResponseEntity<>("폴더 이름이 존재하지 않습니다.", HttpStatus.BAD_REQUEST);
            } // status 400
        }

        if (hompy == null) {
            return new ResponseEntity<>("Unauthorized access", HttpStatus.UNAUTHORIZED);
        } // status 401

        if (boardType == null) {
            return new ResponseEntity<>("요청된 보드 타입이 유효하지 않음", HttpStatus.BAD_REQUEST);
        } // status 400

        if (hompyId != null) {
            boolean hompyCheck = hompyId.equals(hompy.getId());
            if (!hompyCheck) {
                return new ResponseEntity<>("Hompy ID 불일치", HttpStatus.BAD_REQUEST);
            } // status 400
        }

        if (miniHompy == null) {
            return new ResponseEntity<>("miniHompy 존재 하지 않습니다.", HttpStatus.BAD_REQUEST);
        }


        return null; // 모든 검증을 통과한경우.
    }


    // 아싸메인홈피페이지 -> hompy -> board -> write
    // boardType: 1. board, 2. photo, 3. video
    // folder: id

    // 작성
    @PostMapping("/{hompyId}/{postName}/write")
    public ResponseEntity<?> write(
            @PathVariable Long hompyId
            , @PathVariable String postName
            , @RequestBody Folder folder
            , HttpServletRequest request) {

        Hompy hompy = check(request);

        String name = boardTypeName(postName);
        BoardType boardType = boardTypeService.findByName(name);

        ResponseEntity<?> validateResponse = validateRequest(folder, hompy, boardType, hompyId, hompy);

        if (validateResponse != null) {
            return validateResponse;
        }

        return new ResponseEntity<>(folderService.write(folder, hompy, boardType), HttpStatus.OK);// status 200
    }

    @GetMapping("/{hompyId}/{postName}/update/{id}")
    public ResponseEntity<?> updateCheck(
            @PathVariable Long hompyId
            , @PathVariable String postName
            , @RequestBody Folder folder
            , HttpServletRequest request) {

        Hompy hompy = check(request);

        String name = boardTypeName(postName);
        BoardType boardType = boardTypeService.findByName(name);

        ResponseEntity<?> validateResponse = validateRequest(folder, hompy, boardType, hompyId, hompy);

        if (validateResponse != null) {
            return validateResponse;
        }

        return new ResponseEntity<>(folderService.update(folder), HttpStatus.OK);// status 200
    }

    // 수정
    @PutMapping("/{hompyId}/{postName}/update")
    public ResponseEntity<?> update(
            @PathVariable Long hompyId
            , @PathVariable String postName
            , @RequestBody Folder folder
            , HttpServletRequest request) {

        Hompy hompy = check(request);

        String name = boardTypeName(postName);
        BoardType boardType = boardTypeService.findByName(name);

        ResponseEntity<?> validateResponse = validateRequest(folder, hompy, boardType, hompyId, hompy);

        if (validateResponse != null) {
            return validateResponse;
        }

        return new ResponseEntity<>(folderService.update(folder), HttpStatus.OK);// status 200
    }

    // 삭제
    @DeleteMapping("/{hompyId}/{postName}/delete/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long hompyId
            , @PathVariable String postName
            , @PathVariable Long id
            , HttpServletRequest request) {

        Hompy hompy = check(request);

        String name = boardTypeName(postName);
        BoardType boardType = boardTypeService.findByName(name);

        ResponseEntity<?> validateResponse = validateRequest(null, hompy, boardType, hompyId, hompy);

        if (validateResponse != null) {
            return validateResponse;
        }

        return new ResponseEntity<>(folderService.deleteById(id), HttpStatus.OK);// status 200
    }

    @GetMapping("/{hompyId}/{postName}/list")
    public ResponseEntity<?> list(
            @PathVariable Long hompyId
            , @PathVariable String postName
            , HttpServletRequest request) {
        Hompy hompy = check(request);
        Hompy miniHompy = hompyService.findById(hompyId);

        String name = boardTypeName(postName);
        BoardType boardType = boardTypeService.findByName(name);

        ResponseEntity<?> validateResponse = validateRequest(null, hompy, boardType, null, miniHompy);

        if (validateResponse != null) {
            return validateResponse;
        }

        return new ResponseEntity<>(folderService.folderListByBoardType(boardType, miniHompy), HttpStatus.OK);// status 200
    }

    @GetMapping("/{hompyId}/{postName}/scrapfolder")
    public ResponseEntity<?> scrapFolderList(
            @PathVariable Long hompyId
            , @PathVariable String postName
            , HttpServletRequest request) {

        Hompy hompy = check(request); //  스크랩 유저
        Hompy miniHompy = hompyService.findById(hompyId);

        Friend friend = friendService.findByUserAndFriendUser(miniHompy.getUser(),hompy.getUser());

        if(friend == null){
            return new ResponseEntity<>("일촌관계 가 아닙니다.",HttpStatus.NOT_FOUND);
        }

        String name = boardTypeName(postName);
        BoardType boardType = boardTypeService.findByName(name);

        ResponseEntity<?> validateResponse = validateRequest(null, hompy, boardType, null, miniHompy);

        if (validateResponse != null) {
            return validateResponse;
        }

        return new ResponseEntity<>(folderService.folderListByBoardType(boardType, hompy), HttpStatus.OK);// status 200
    }

}

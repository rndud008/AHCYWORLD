package com.lec.spring.controller;

import com.lec.spring.domain.*;
import com.lec.spring.jwt.JWTUtil;
import com.lec.spring.service.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
public class PostController {

    private final PostService postService;
    private final UserService userService;
    private final FriendService friendService;
    private final HompyService hompyService;
    private final FolderService folderService;
    private final AttachmentService attachmentService;
    private  final JWTUtil jwtUtil;

    public PostController(PostService postService, UserService userService, FriendService friendService, HompyService hompyService, FolderService folderService, AttachmentService attachmentService, JWTUtil jwtUtil) {
        this.postService = postService;
        this.userService = userService;
        this.friendService = friendService;
        this.hompyService = hompyService;
        this.folderService = folderService;
        this.attachmentService = attachmentService;
        this.jwtUtil = jwtUtil;
    }

    public Hompy check(HttpServletRequest request){

        String authorization  = request.getHeader("Authorization");

        if(authorization == null || !authorization.startsWith("Bearer")){
            return null;
        }

        String token = authorization.split(" ")[1];

        if(jwtUtil.isExpired(token)){
            return null;
        }

        Long id = jwtUtil.getId(token);

        User user = userService.findByUserId(id).orElse(null);

        if(user == null){
            return null;
        }

        return hompyService.findHompyByuser(user);
    }

    public String boardTypeName(String boardtype){
        if(boardtype.equals("board")){
            return "게시판";
        }

        if(boardtype.equals("photo")){
            return "사진첩";
        }

        if(boardtype.equals("video")){
            return "동영상";
        }

        return "";
    }

    private ResponseEntity<?> validateRequest(Hompy hompy, String boardName, Folder folder, Long hompyId, Folder moveFolder,String action, Folder scrapFolder,Post post){

        if (hompy == null) {
            return new ResponseEntity<>("Unauthorized access", HttpStatus.UNAUTHORIZED);
        } // status 401
        Hompy miniHompy = hompyService.findById(hompyId);

        if(action.equals("scrap")){

            // 스크랩시 홈피유저가 스크랩하는 친구유저의 id를 가지고 있지 않는경우.
            // 해당 hompy객체는 scrap 을시도하는  USER는 -> 친구유저,
            // miniHompy 객체는 게시물을 가지고 있는 미니홈피User
            boolean friendUserCheck = friendService.findByUserAndFriendUser(hompy.getUser(),miniHompy.getUser()) != null;
            if(!friendUserCheck){
                return new ResponseEntity<>("일촌 관계에 해당하지 않아 스크랩이 불가합니다.", HttpStatus.FORBIDDEN);
            }// status 403

            boolean scrapUserFolderCheck = scrapFolder.getHompy().getId().equals(hompy.getId());
            if(!scrapUserFolderCheck){
                return new ResponseEntity<>("해당홈피에 scrapFolder가 존재하지 않습니다.", HttpStatus.BAD_REQUEST);
            } // status 400

            boolean scrapBoardTypeNameCheck = scrapFolder.getBoardType().getName().equals(post.getFolder().getBoardType().getName());
            if(!scrapBoardTypeNameCheck){
                return new ResponseEntity<>("보드타입 이름이 유효하지 않음.", HttpStatus.BAD_REQUEST);
            } // status 400

            boolean postFolderCheck = post.getFolder().getId().equals(folder.getId());
            if(!postFolderCheck){
                return new ResponseEntity<>("게시물이 해당 폴더에 존재하지않음.", HttpStatus.BAD_REQUEST);
            } // status 400

        }

        if (action.equals("null")){
            boolean hompyCheck = hompyId.equals(hompy.getId());
            if(!hompyCheck){
                return new ResponseEntity<>("Hompy ID 불일치", HttpStatus.BAD_REQUEST);
            } // status 400

        }

        String name = boardTypeName(boardName);

        boolean boardTypeCheck = folder.getBoardType().getName().equals(name);
        if(!boardTypeCheck){
            return new ResponseEntity<>("요청된 보드 타입이 유효하지 않음", HttpStatus.BAD_REQUEST);
        } // status 400

        boolean folderCheck = folder.getHompy().getId().equals(miniHompy.getId());
        if(!folderCheck){
            return new ResponseEntity<>("Folder 가 해당홈피에 속하지않음", HttpStatus.FORBIDDEN);
        } // status 403


        if(moveFolder != null){

            boardTypeCheck = moveFolder.getBoardType().getName().equals(name);
            if(!boardTypeCheck){
                return new ResponseEntity<>("요청된 moveFolder의 보드 타입이 유효하지 않음", HttpStatus.BAD_REQUEST);
            } // status 400

            folderCheck = moveFolder.getHompy().getId().equals(hompy.getId());
            if(!folderCheck){
                return new ResponseEntity<>("moveFolder 가 해당홈피에 속하지않음", HttpStatus.FORBIDDEN);
            } // status 403

            boolean postBoardTypeNameCheck = post.getFolder().getBoardType().getName().equals(moveFolder.getBoardType().getName());
            if(!postBoardTypeNameCheck){
                return new ResponseEntity<>("이동하는 post의 폴더위치를 다시 확인해주세요.", HttpStatus.FORBIDDEN);
            } // status 403

            boolean postHompyIdCheck = post.getFolder().getHompy().getId().equals(hompy.getId());
            if(!postHompyIdCheck){
                return new ResponseEntity<>("요청된 post는 홈피에 존재하지 않습니다.", HttpStatus.BAD_REQUEST);
            } // status 400

        }

        return null; // 모든 검증을 통과한경우.
    }


    // 아싸메인홈피페이지 -> hompy -> board -> folder -> write
    // boardType: 1. board, 2. photo, 3. video
    // folder: id

    // 작성
    @PostMapping("/{hompyId}/{boardName}/{folderId}/write")
    public ResponseEntity<?> write(
            @PathVariable Long hompyId
            ,@PathVariable String boardName
            ,@PathVariable Long folderId
            , @RequestBody Post post
            , HttpServletRequest request
            , @RequestParam Map<String, MultipartFile> files){

        Hompy hompy = check(request);
        Folder folder = folderService.findById(folderId);

        ResponseEntity<?> validateResponse = validateRequest(hompy,boardName,folder,hompyId,null,"null", null,null);

        if (validateResponse != null) {
            return validateResponse;
        }

        return new ResponseEntity<>(postService.write(post,files,folder), HttpStatus.OK);// status 200
    }

    // 수정
    @PutMapping("/{hompyId}/{boardName}/{folderId}/update")
    public ResponseEntity<?> update(
            @PathVariable Long hompyId
            ,@PathVariable String  boardName
            ,@PathVariable Long folderId
            , @RequestParam Map<String,MultipartFile> files
            , @RequestBody Post post
            , Long[] delFile
            , HttpServletRequest request){

        Hompy hompy = check(request);
        Folder folder = folderService.findById(folderId);

        ResponseEntity<?> validateResponse = validateRequest(hompy,boardName,folder,hompyId,null,"null",null,null);

        if (validateResponse != null) {
            return validateResponse;
        }

        return new ResponseEntity<>(postService.update(post,files,delFile), HttpStatus.OK);// status 200
    }

    // 삭제
    @DeleteMapping("/{hompyId}/{boardName}/{folderId}/delete/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long hompyId
            ,@PathVariable String  boardName
            ,@PathVariable Long folderId
            , @PathVariable Long id
            , HttpServletRequest request){
        Hompy hompy = check(request);
        Folder folder = folderService.findById(folderId);

        ResponseEntity<?> validateResponse = validateRequest(hompy,boardName,folder,hompyId,null,"null",null,null);

        if (validateResponse != null) {
            return validateResponse;
        }

        return new ResponseEntity<>(postService.deleteById(id), HttpStatus.OK); // status 200
    }

    // 조회 - 조회수 증가.
    @GetMapping("/{hompyId}/{boardName}/{folderId}/detail/{id}")
    public ResponseEntity<?> detail(
            @PathVariable Long hompyId
            ,@PathVariable String  boardName
            ,@PathVariable Long folderId
            , @PathVariable Long id
            , HttpServletRequest request){

        Hompy hompy = check(request);
        Folder folder = folderService.findById(folderId);

        ResponseEntity<?> validateResponse = validateRequest(hompy,boardName,folder,hompyId,null,"detail",null,null);

        if (validateResponse != null) {
            return validateResponse;
        }

        return new ResponseEntity<>(postService.detail(id), HttpStatus.OK);// status 200
    }

    // 게시물 폴더 이동.
    @PutMapping("/{hompyId}/{boardName}/{folderId}/detail/{id}/{moveFolderId}")
    public ResponseEntity<?> movePost(
            @PathVariable Long hompyId
            ,@PathVariable String  boardName
            ,@PathVariable Long folderId
            ,@PathVariable Long moveFolderId
            , @PathVariable Long id
            , HttpServletRequest request){

        Hompy hompy = check(request);
        Post post = postService.selectedById(id);
        Folder folder = folderService.findById(folderId);
        Folder moveFolder = folderService.findById(moveFolderId);

        ResponseEntity<?> validateResponse = validateRequest(hompy,boardName,folder,hompyId,moveFolder,"null",null, post);

        if (validateResponse != null) {
            return validateResponse;
        }

        return new ResponseEntity<>(postService.movePost(post, moveFolder), HttpStatus.OK);// status 200
    }

    // 게시물 스크랩.
    @PostMapping("/{hompyId}/{boardName}/{folderId}/detail/{scrapFolderId}")
    public ResponseEntity<?> scrapPost(
            @PathVariable Long hompyId
            , @PathVariable String  boardName
            , @PathVariable Long folderId
            , @PathVariable Long scrapFolderId
            , @RequestBody Post post
            , HttpServletRequest request){

        Hompy hompy = check(request);
        List<Attachment> attachmentList = attachmentService.findByPost(post);
        Folder folder = folderService.findById(folderId);
        Folder scrapFolder = folderService.findById(scrapFolderId);

        ResponseEntity<?> validateResponse = validateRequest(hompy, boardName, folder, hompyId,null,"scrap", scrapFolder, post);

        if (validateResponse != null) {
            return validateResponse;
        }

        return new ResponseEntity<>(postService.scrapPost(post,scrapFolder,attachmentList), HttpStatus.OK);// status 200
    }

    // 조회 - 조회수 증가X
    @GetMapping("/{hompyId}/{boardName}/{folderId}/update/{id}")
    public ResponseEntity<?> updateCheck(
            @PathVariable Long hompyId
            ,@PathVariable String  boardName
            ,@PathVariable Long folderId
            , @PathVariable Long id
            , HttpServletRequest request){

        Hompy hompy = check(request);
        Folder folder = folderService.findById(folderId);

        ResponseEntity<?> validateResponse = validateRequest(hompy,boardName,folder,hompyId,null,"null",null,null);

        if (validateResponse != null) {
            return validateResponse;
        }

        return new ResponseEntity<>(postService.selectedById(id), HttpStatus.OK);// status 200
    }

    // list?
    @GetMapping("/{hompyId}/{boardName}/{folderId}/list")
    public ResponseEntity<?> list(
            @PathVariable Long hompyId
            ,@PathVariable String  boardName
            ,@PathVariable Long folderId
            ,@RequestParam(defaultValue = "0") Integer page
            , HttpServletRequest request){

        Hompy hompy = check(request);
        Folder folder = folderService.findById(folderId);
        String url = request.getRequestURI();

        ResponseEntity<?> validateResponse = validateRequest(hompy,boardName,folder,hompyId,null,"list",null,null);

        if (validateResponse != null) {
            return validateResponse;
        }

        return new ResponseEntity<>(postService.list(page,url,folder), HttpStatus.OK);// status 200
    }

}

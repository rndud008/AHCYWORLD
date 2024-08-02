package com.lec.spring.service;

import com.lec.spring.domain.*;
import com.lec.spring.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PostService {

    @Value("${app.upload.path}")
    private String UPLOADDIR;
    @Value("${app.pagination.write_pages}")
    private int WRITE_PAGE;
    @Value("${app.pagination.page_rows}")
    private int PAGE_ROWS;

    private final FolderRepository folderRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final AttachmentRepository attachmentRepository;
    private final CommentRepository commentRepository;

    public PostService(FolderRepository folderRepository, PostRepository postRepository, UserRepository userRepository, AttachmentRepository attachmentRepository, CommentRepository commentRepository) {
        this.folderRepository = folderRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.attachmentRepository = attachmentRepository;
        this.commentRepository = commentRepository;
    }

    private Attachment upload(MultipartFile multipartFile){
        // 물리적으로 파일을 서버에 저장.
        Attachment attachment = null;

        String originalFileName = multipartFile.getOriginalFilename();
        boolean check = originalFileName == null || originalFileName.trim().isEmpty();
        if (check) return null;
        // 첨부파일이 없는경우.

        String sourceName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
        // 원본 파일명

        String fileName = sourceName;
        // 저장될 파일명

        File file = new File(UPLOADDIR,fileName);
        if(file.exists()){
            // 파일이 중복되는지 확인.

            int pos = fileName.lastIndexOf(".");

            if(pos > -1){
                // 확장자가 있는 경우.

                String name = fileName.substring(0,pos);
                String ext = fileName.substring(pos+1);

                fileName = name + "_" + System.currentTimeMillis() + "." + ext;

            }else {
                // 확장자가 없는 경우.
                fileName += "-" + System.currentTimeMillis();
            }

        }

        Path copyPath = Paths.get(new File(UPLOADDIR,fileName).getAbsolutePath());

        try {
            Files.copy(multipartFile.getInputStream(), copyPath, StandardCopyOption.REPLACE_EXISTING);
            // 기존에 존재하면 덮어쓰기.

        }catch (IOException e){
            throw new RuntimeException(e);
        }

        attachment = Attachment.builder()
                .fileName(fileName)
                .sourceName(sourceName)
                .build();

        return attachment;
    }

    private void addFiles(Map<String, MultipartFile> files, Post post){
        if(files == null) return;

        for(Map.Entry<String,MultipartFile> e : files.entrySet()){
//            if (!e.getKey().startsWith("upfile")) continue;
//            위의 기능은 웹에디터를 사용하게 될경우 사용

            Attachment file = upload(e.getValue());
            // 물리적인 파일저장.

            if(file != null){
                file.setPost(post);
                attachmentRepository.save(file);
            }
        }

        // 첨부파일들 을 가져와서 image 파일 관련 세팅.
        List<Attachment> fileList = attachmentRepository.findByPost(post).orElse(null);
        setImage(fileList);
        post.setImageList(fileList);
        postRepository.save(post);
    }

    private void setImage(List<Attachment> fileList){
        // 이미지 파일 여부 세팅.

        String realPath = new File(UPLOADDIR).getAbsolutePath();

        for(Attachment attachment : fileList){
            BufferedImage bufferedImage = null;
            File file = new File(realPath,attachment.getFileName());

            try {
                bufferedImage = ImageIO.read(file);
                // 이미지가 아닌경우 null 을 리턴 그리고 파일이 존재하지 않으면 IOException 발생.

                if(bufferedImage != null) attachment.setImage(true);
            } catch (IOException e) {
                System.out.println("파일이 존재하지 않음.");
            }
        }
    }

    private void deleteFile(Attachment attachment){
        String saveDir = new File(UPLOADDIR).getAbsolutePath();

        File file = new File(saveDir,attachment.getFileName());
        // 저장된 파일명.

        if(file.exists()){
            if (file.delete()){
                System.out.println("삭제성공");
            }else {
                System.out.println("삭제 실패");
            }
        }else {
            System.out.println("파일이 존재하지 않음.");
        }

    }

    @Transactional
    public int write(Post post, Map<String,MultipartFile> files, Folder folder){
        int result = 0;

        // 폴더 세팅?
        post.setFolder(folder);

        // 글저장
        post = postRepository.saveAndFlush(post);

        // 첨부파일 추가.
        addFiles(files,post);

        return result;
    }

    // 게시판 디테일.
    @Transactional
    public Post detail(Long id){
        Post post = postRepository.findById(id).orElse(null);

        if(post != null){
            post.setViewCnt(post.getViewCnt() + 1);
        }

        return post;
    }

    // 게시판 리스트, (사진첩, 동영상 디테일 리스트).
    @Transactional(readOnly = true)
    public Pagenation list(Integer page,String url,Folder folder){
        Pagenation pagenation = new Pagenation();

        // 현재 페이지
        if(page == null || page < 1) page =1;

        Page<Post> postPage = postRepository.findByFolder(folder,PageRequest.of(page-1, PAGE_ROWS, Sort.by(Sort.Order.desc("id"))));

        long cnt = postPage.getTotalElements();
        int totalPage = postPage.getTotalPages();

        int startPage = 0;
        int endPage = 0;

        List<Post> list = null;

        if(cnt > 0){
            if(page > totalPage) page = totalPage;

//            int fromRow = (page-1) * PAGE_ROWS;

            startPage = (((page-1)/WRITE_PAGE) *WRITE_PAGE) +1;
            endPage = startPage + WRITE_PAGE -1;
            if(endPage >= totalPage) endPage = totalPage;

            list = postPage.getContent();
        }else {
            page = 0;
        }

        return pagenation.builder()
                .cnt(cnt)
                .totalPage(totalPage)
                .writepages(WRITE_PAGE)
                .pagerows(PAGE_ROWS)
                .page(page)
                .startpage(startPage)
                .endpage(endPage)
                .posts(list)
                .url(url)
                .build();
    }

    // 게시물 정보 가져오기
    @Transactional
    public Post selectedById(Long id){

        return postRepository.findById(id).orElse(null);
    }

    // 게시물 정보 업데이트
    @Transactional
    public int update(Post post, Map<String, MultipartFile> files, Long[] delFile){
        int result = 0;

        Post oringPost = postRepository.findById(post.getId()).orElse(null);

        if(oringPost != null){
            oringPost.setSubject(post.getSubject());
            oringPost.setContent(post.getContent());

            oringPost = postRepository.saveAndFlush(oringPost);

            addFiles(files,oringPost);

            if(delFile != null){
                for(Long fileId: delFile){
                    Attachment file = attachmentRepository.findById(fileId).orElse(null);
                    if(file != null){
                        deleteFile(file);
                        attachmentRepository.delete(file);
                    }
                }
            }
            result = 1;
        }

        return result;
    }

    // 게시물 삭제
    @Transactional
    public int deleteById(Long id){
        int result = 0;

        Post post = postRepository.findById(id).orElse(null);
        if(post != null){

            List<Attachment> fileList = attachmentRepository.findByPost(post).orElse(null);

            if(fileList != null && fileList.size() > 0){
                for(Attachment file: fileList){
                    deleteFile(file);
                }
            }

            postRepository.delete(post);
            result =1;
        }
        return result;
    }

    // 게시물 폴더 이동.
    @Transactional
    public Post movePost(Post post, Folder moveFolder){
        post.setFolder(moveFolder);

        return post;
    }


    // 게시물 스크랩.
    @Transactional
    public Post scrapPost(Post post,Folder scrapFolder,List<Attachment> attachmentList){

        Post originPost = postRepository.findById(post.getId()).orElse(null);
        Post copyPost = Post.builder()
                .subject(originPost.getSubject())
                .content(originPost.getContent())
                .folder(scrapFolder)
                .build();

        postRepository.saveAndFlush(copyPost);
        List<Attachment> copyAttachmentList = new ArrayList<>();

        if(attachmentList != null){
            for (Attachment attachment : attachmentList) {
                Attachment copyAttachment = Attachment.builder()
                        .post(copyPost)
                        .sourceName(attachment.getSourceName())
                        .fileName(attachment.getFileName())
                        .build();

                attachmentRepository.saveAndFlush(copyAttachment);
                copyAttachmentList.add(copyAttachment);
            }
            setImage(copyAttachmentList);
            copyPost.setImageList(copyAttachmentList);
            postRepository.save(copyPost);
        }

        originPost.setScrap(originPost.getScrap() + 1);
        postRepository.saveAndFlush(originPost);

        Comment comment = Comment.builder()
                .post(originPost)
                .user(copyPost.getFolder().getHompy().getUser())
                .content("퍼가요!")
                .build();

        commentRepository.save(comment);

        return copyPost;
    }


}

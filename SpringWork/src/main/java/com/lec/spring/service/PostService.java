package com.lec.spring.service;

import com.lec.spring.domain.*;
import com.lec.spring.repository.*;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
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
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PostService {

    @Value("${app.pagination.write_pages}")
    private int WRITE_PAGE;
    @Value("${app.pagination.page_rows}")
    private int PAGE_ROWS;

    private final PostRepository postRepository;
    private final AttachmentRepository attachmentRepository;
    private final CommentRepository commentRepository;
    private final AttachmentService attachmentService;

    public PostService(PostRepository postRepository, AttachmentRepository attachmentRepository, CommentRepository commentRepository, AttachmentService attachmentService) {

        this.postRepository = postRepository;
        this.attachmentRepository = attachmentRepository;
        this.commentRepository = commentRepository;
        this.attachmentService = attachmentService;

    }

    @Transactional
    public long write(Post post, Map<String, MultipartFile> files, Folder folder) {
        long result = 0;

        post.setFolder(folder);

        post = postRepository.saveAndFlush(post);

        attachmentService.addFiles(files, post);

        return post.getId() != null ? post.getId() : result;
    }

    // 게시판 디테일.
    @Transactional
    public Post detail(Long id) {
        Post post = postRepository.findById(id).orElse(null);

        if (post != null) {
            post.setViewCnt(post.getViewCnt() + 1);
            post.setUpdateViews(false);

            // 첨부파일들 을 가져와서 image 파일 관련 세팅.
            List<Attachment> fileList = attachmentRepository.findByPostId(post.getId());
            attachmentService.setImageAndVideo(fileList);
            post.setFileList(fileList);
        }

        return post;
    }

    // 게시판 리스트, (사진첩, 동영상 디테일 리스트).
    @Transactional(readOnly = true)
    public Pagenation list(Integer page, String url, Folder folder) {
        Pagenation pagenation = new Pagenation();

        // 현재 페이지
        if (page == null || page < 1) page = 1;

        Page<Post> postPage = postRepository.findByFolder(folder, PageRequest.of(page - 1, PAGE_ROWS, Sort.by(Sort.Order.desc("id"))));

        long cnt = postPage.getTotalElements();
        int totalPage = postPage.getTotalPages();

        int startPage = 0;
        int endPage = 0;

        List<Post> list = null;

        if (cnt > 0) {
            if (page > totalPage) page = totalPage;

            startPage = (((page - 1) / WRITE_PAGE) * WRITE_PAGE) + 1;
            endPage = startPage + WRITE_PAGE - 1;
            if (endPage >= totalPage) endPage = totalPage;

            list = postPage.getContent();

        } else {
            page = 0;
        }

        if (list != null) {
            for (Post post : list) {
                attachmentService.setImageAndVideo(post.getFileList());
            }
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
    public Post selectedById(Long id) {

        Post post = postRepository.findById(id).orElse(null);

        if (post != null) {
            List<Attachment> fileList = attachmentRepository.findByPostId(post.getId());
            attachmentService.setImageAndVideo(fileList);
            post.setFileList(fileList);
            post.setUpdateViews(false);
        }

        return post;
    }

    // 게시물 정보 업데이트
    @Transactional
    public int update(Post post, Map<String, MultipartFile> files, Long[] delFile) {
        int result = 0;

        Post oringPost = postRepository.findById(post.getId()).orElse(null);

        if (oringPost != null) {
            oringPost.setSubject(post.getSubject());
            oringPost.setContent(post.getContent());

            attachmentService.addFiles(files, oringPost);

            if (delFile != null) {
                for (Long fileId : delFile) {
                    Attachment file = attachmentRepository.findById(fileId).orElse(null);
                    if (file != null) {
                        attachmentService.deleteFile(file); // 물리적 파일 제거.
                        oringPost.getFileList().remove(file);
                        attachmentRepository.delete(file);
                    }
                }
                oringPost.setFileList(oringPost.getFileList());
            }

            result = 1;
        }

        return result;
    }

    // 게시물 삭제
    @Transactional
    public int deleteById(Long id) {
        int result = 0;

        Post post = postRepository.findById(id).orElse(null);
        if (post != null) {

            List<Attachment> fileList = attachmentRepository.findByPostId(post.getId());

            if (fileList != null && fileList.size() > 0) {
                for (Attachment file : fileList) {
                    attachmentService.deleteFile(file);
                }
            }

            postRepository.delete(post);
            result = 1;
        }
        return result;
    }

    // 게시물 폴더 이동.
    @Transactional
    public Post movePost(Post post, Folder moveFolder) {
        post.setFolder(moveFolder);
        post.setUpdateViews(false);

        return post;
    }

    // 게시물 스크랩.
    @Transactional
    public Post scrapPost(Post post, Folder scrapFolder, List<Attachment> attachmentList) {

        Post originPost = postRepository.findById(post.getId()).orElse(null);
        Post copyPost = Post.builder()
                .subject("[스크랩]" + originPost.getSubject())
                .content(originPost.getContent())
                .folder(scrapFolder)
                .updateViews(true)
                .build();

        copyPost = postRepository.save(copyPost);
        List<Attachment> copyAttachmentList = new ArrayList<>();

        if (attachmentList != null) {
            for (Attachment attachment : attachmentList) {
                Attachment copyAttachment = Attachment.builder()
                        .post(copyPost)
                        .sourceName(attachment.getSourceName())
                        .fileName(attachment.getFileName())
                        .build();
                copyAttachmentList.add(copyAttachment);
            }
            copyAttachmentList = attachmentRepository.saveAll(copyAttachmentList);
            attachmentService.setImageAndVideo(copyAttachmentList);
            copyPost.setFileList(copyAttachmentList);
            postRepository.saveAndFlush(copyPost);
        }
        originPost.setUpdateViews(false);
        originPost.setScrap(originPost.getScrap() + 1);
        postRepository.save(originPost);

        Comment comment = Comment.builder()
                .post(originPost)
                .user(copyPost.getFolder().getHompy().getUser())
                .content("퍼가요!")
                .build();

        commentRepository.save(comment);

        return copyPost;
    }

}

package com.lec.spring.service;

import com.lec.spring.domain.Attachment;
import com.lec.spring.domain.Post;
import com.lec.spring.repository.AttachmentRepository;
import com.lec.spring.repository.PostRepository;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
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
import java.util.List;
import java.util.Map;

@Service
public class AttachmentService {

    @Value("${app.upload.path}")
    private String UPLOADDIR;

    private  final PostRepository postRepository;
    private  final AttachmentRepository attachmentRepository;

    public AttachmentService(PostRepository postRepository, AttachmentRepository attachmentRepository) {
        this.postRepository = postRepository;
        this.attachmentRepository = attachmentRepository;
    }

    public List<Attachment> findByPost(Post post){
        return attachmentRepository.findByPostId(post.getId());
    }

    public Attachment findById(Long id){ return attachmentRepository.findById(id).orElse(null);}

    public Attachment upload(MultipartFile multipartFile) {
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

        File file = new File(UPLOADDIR, fileName);
        if (file.exists()) {
            // 파일이 중복되는지 확인.

            int pos = fileName.lastIndexOf(".");

            if (pos > -1) {
                // 확장자가 있는 경우.

                String name = fileName.substring(0, pos);
                String ext = fileName.substring(pos + 1);

                fileName = name + "_" + System.currentTimeMillis() + "." + ext;

            } else {
                // 확장자가 없는 경우.
                fileName += "-" + System.currentTimeMillis();
            }

        }

        Path copyPath = Paths.get(new File(UPLOADDIR, fileName).getAbsolutePath());

        try {
            Files.copy(multipartFile.getInputStream(), copyPath, StandardCopyOption.REPLACE_EXISTING);
            // 기존에 존재하면 덮어쓰기.

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        attachment = Attachment.builder()
                .fileName(fileName)
                .sourceName(sourceName)
                .build();

        return attachment;
    }

    public void addFiles(Map<String, MultipartFile> files, Post post) {
        if (files == null) return;

        for (Map.Entry<String, MultipartFile> e : files.entrySet()) {
            if (!e.getKey().startsWith("files")) continue;

            Attachment file = upload(e.getValue());
            // 물리적인 파일저장.

            if (file != null) {
                file.setPost(post);
                attachmentRepository.save(file);
            }
        }

        List<Attachment> attachmentList = attachmentRepository.findByPostId(post.getId());
        post.setFileList(attachmentList);
        postRepository.save(post);

    }

    public void setImageAndVideo(List<Attachment> fileList) {
        // 이미지 파일 여부 세팅.

        String realPath = new File(UPLOADDIR).getAbsolutePath();

        for (Attachment attachment : fileList) {
            BufferedImage bufferedImage = null;
            File file = new File(realPath, attachment.getFileName());

            Tika tika = new Tika();
            String mimeType;

            try {
                bufferedImage = ImageIO.read(file);
                // 이미지가 아닌경우 null 을 리턴 그리고 파일이 존재하지 않으면 IOException 발생.

                mimeType = tika.detect(file);

                if (mimeType.startsWith("video/")) attachment.setVideo(true);
                if (bufferedImage != null) attachment.setImage(true);
            } catch (IOException e) {
                System.out.println("파일이 존재하지 않음.");
            }
        }
    }

    public void deleteFile(Attachment attachment) {
        String saveDir = new File(UPLOADDIR).getAbsolutePath();

        File file = new File(saveDir, attachment.getFileName());
        // 저장된 파일명.

        if (file.exists()) {

            if (file.delete()) {
                System.out.println("삭제성공");

            } else {
                System.out.println("삭제 실패");
            }
        } else {
            System.out.println("파일이 존재하지 않음.");
        }

    }


}

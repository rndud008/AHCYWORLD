package com.lec.spring.controller;

import com.lec.spring.domain.Attachment;
import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import com.lec.spring.jwt.JWTUtil;
import com.lec.spring.service.AttachmentService;
import com.lec.spring.service.HompyService;
import com.lec.spring.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import javax.mail.Quota;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping
public class AttachmentController {
    @Value("${app.upload.path}")
    private String UPLOADDIR;
    private final AttachmentService attachmentService;
    private final JWTUtil jwtUtil;
    private final UserService userService;
    private final HompyService hompyService;

    public AttachmentController(AttachmentService attachmentService, JWTUtil jwtUtil, UserService userService, HompyService hompyService) {
        this.attachmentService = attachmentService;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.hompyService = hompyService;
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

    @RequestMapping("/post/download")
    public ResponseEntity<?> download(Long id, HttpServletRequest request) {

        Hompy hompy = check(request);

        if (hompy == null) {
            return new ResponseEntity<>("Unauthorized access", HttpStatus.UNAUTHORIZED);
        }

        if (id == null) return new ResponseEntity<>("id가 존재하지 않습니다.", HttpStatus.BAD_REQUEST);

        Attachment file = attachmentService.findById(id);
        if (file == null) return new ResponseEntity<>("파일이 존재하지 않습니다.", HttpStatus.NOT_FOUND);

        String sourceName = file.getSourceName();

        String fileName = file.getFileName();

        String path = new File(UPLOADDIR, fileName).getAbsolutePath();

        try {
            String mimeType = Files.probeContentType(Paths.get(path));

            if (mimeType == null) {
                mimeType = "application/octet-stream";
            }

            Path filePath = Paths.get(path);

            Resource resource = new InputStreamResource(Files.newInputStream(filePath));

            HttpHeaders headers = new HttpHeaders();

            headers.setContentDisposition(
                    ContentDisposition.builder("attachment")
                            .filename(URLEncoder.encode(sourceName, "UTF-8"))
                            .build()
            );

            headers.setCacheControl("no-cache");

            headers.setContentType(MediaType.parseMediaType(mimeType));

            return new ResponseEntity<>(resource, headers, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(null, null, HttpStatus.CONFLICT);

        }

    }

    @GetMapping("/post/{filename:.+}")
    public ResponseEntity<?> imageFile(@PathVariable String filename) {

        File file = new File(UPLOADDIR + File.separator + filename);
        if (file.exists()) {
            FileSystemResource resource = new FileSystemResource(file);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                    .body(resource);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

    }

    @GetMapping("/video/{filename:.+}")
    public ResponseEntity<?> videoFile(@PathVariable("filename") String filename) {
        File file = new File(UPLOADDIR + File.separator + filename);

        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Resource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .body(resource);
    }

}

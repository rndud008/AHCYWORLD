package com.lec.spring.controller;

import com.lec.spring.domain.Item;
import com.lec.spring.service.ItemService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/item")
public class ItemController {

    public final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping("/musicsave")
    @CrossOrigin
    public ResponseEntity<?> musicsave(@RequestBody Item item) {
        return new ResponseEntity<>(itemService.save(item), HttpStatus.CREATED);
    }

    @GetMapping("/{type}")
    @CrossOrigin
    public ResponseEntity<?> visibleItemList(
            @PathVariable String type
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "") String searchItem
            , HttpServletRequest request) {
        String url = request.getRequestURI();
        System.out.println("주소:  " + url);
        return new ResponseEntity<>(itemService.list(page, url, type, searchItem), HttpStatus.OK);
    }

    @GetMapping("/admin/{type}")
    @CrossOrigin
    public ResponseEntity<?> allItemList(
            @PathVariable String type
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "") String searchItem
            , HttpServletRequest request) {
        String url = request.getRequestURI();
        System.out.println("주소:  " + url);
        return new ResponseEntity<>(itemService.list(page, url, type, searchItem), HttpStatus.OK);
    }

    @PostMapping("/admin/update")
    @CrossOrigin
    public ResponseEntity<?> updateItem(@RequestBody Item item) {
        return new ResponseEntity<>(itemService.update(item), HttpStatus.OK);
    }

    @PostMapping("/admin/add")
    @CrossOrigin
    public ResponseEntity<?> addItem(@RequestBody Item item) {
        return new ResponseEntity<>(itemService.save(item), HttpStatus.CREATED);
    }

    @PostMapping("/admin/file")
    @CrossOrigin
    public ResponseEntity<?> uploadFile(@RequestParam("image") MultipartFile file) {
        List<String> files = new ArrayList();
        boolean found = false;

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }


        Path Dir = Paths.get("../ahcyworld-app/public", "image").toAbsolutePath();
        if (Files.isDirectory(Dir)) {
            try (DirectoryStream<Path> directoryStream = Files.newDirectoryStream(Dir)) {
                for (Path path : directoryStream) {
                    files.add(path.getFileName().toString());
                }
            } catch (IOException e) {
                System.err.println("Error reading directory: " + e.getMessage());
            }
        } else {
            System.out.println(Dir + " is not a directory.");
        }


        try {
            // 파일 저장 위치 지정 및 저장 로직 추가
            String fileName = file.getOriginalFilename();
            for (String name : files) {
                if (name.equals(fileName)) {
                    found = true;
                    break;
                }
            }
            String uploadDir = Paths.get("../ahcyworld-app/public", "image").toAbsolutePath().toString();
            System.out.println(uploadDir);
            // 실제 파일 저장
            if (found) {
                int pos = fileName.lastIndexOf(".");
                if (pos > -1) {
                    String name = fileName.substring(0, pos);
                    String ext = fileName.substring(pos + 1);

                    fileName = name + "_" + System.currentTimeMillis() + "." + ext;
                    file.transferTo(new java.io.File(uploadDir + "/" + fileName));
                } else {
                    fileName += "_" + System.currentTimeMillis();
                }
            } else {
                file.transferTo(new java.io.File(uploadDir + "/" + fileName));
            }

            return new ResponseEntity<>(fileName, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("파일 업로드 실패: " + e.getMessage());
        }

    }

    @GetMapping("/admin/duplicaion")
    @CrossOrigin
    public ResponseEntity<?> duplication(@RequestParam String itemname) {

        System.out.println("여기오냐?"+itemname);
        return new ResponseEntity<>(itemService.duplication(itemname), HttpStatus.OK);
    }


}

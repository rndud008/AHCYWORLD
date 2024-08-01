package com.lec.spring.controller;

import com.lec.spring.domain.Diary;
import com.lec.spring.repository.DiaryRepository;
import com.lec.spring.service.DiaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cyworld/cy")
public class DiaryController {

    public final DiaryService diaryService;

    public DiaryController(DiaryService diaryService) {
        this.diaryService = diaryService;
    }

    @CrossOrigin
    @PostMapping("/diary/save")
    public ResponseEntity<?> save(@RequestBody Diary diary) {
        return new ResponseEntity<>(diaryService.save(diary), HttpStatus.CREATED);
    }

    @CrossOrigin
    @GetMapping("/diary/{id}")
    public ResponseEntity<?> detail(@PathVariable Long id) {
        return new ResponseEntity<>(diaryService.findById(id), HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/diary")
    public ResponseEntity<?> list() {
        return new ResponseEntity<>(diaryService.findAll(), HttpStatus.OK);
    }

    @CrossOrigin
    @PutMapping("/diary")
    public ResponseEntity<?> update(@RequestBody Diary diary) {
        return new ResponseEntity<>(diaryService.update(diary), HttpStatus.OK);
    }

    @CrossOrigin
    @DeleteMapping("/diary/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return new ResponseEntity<>(diaryService.delete(id), HttpStatus.OK);
    }
}

package com.lec.spring.controller;

import com.lec.spring.domain.Diary;
import com.lec.spring.repository.DiaryRepository;
import com.lec.spring.service.DiaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

@RestController
@RequestMapping("/cyworld/cy/diaries")
public class DiaryController {

    public final DiaryService diaryService;

    public DiaryController(DiaryService diaryService) {
        this.diaryService = diaryService;
    }

    @CrossOrigin
    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Diary diary) {
        return new ResponseEntity<>(diaryService.save(diary), HttpStatus.CREATED);
    }

    @CrossOrigin
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable Long id) {
        Diary diary = diaryService.findById(id);
        if (diary == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(diary, HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/list")
    public ResponseEntity<?> list() {
        return new ResponseEntity<>(diaryService.findAll(), HttpStatus.OK);
    }

    // 달력의 내용 출력
    @CrossOrigin
    @GetMapping("/detail-by-date/{date}")
    public ResponseEntity<?> detailByDate(@PathVariable String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);        // 날짜형식 변환
            Diary diary = diaryService.findByDate(localDate);
            if (diary == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(diary, HttpStatus.OK);
        }catch (DateTimeParseException e) {
            return new ResponseEntity<>("Invalid date format", HttpStatus.BAD_REQUEST);
        }
    }

    @CrossOrigin
    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody Diary diary) {
        int result = diaryService.update(diary);
        if (result == 0){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @CrossOrigin
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        int result = diaryService.delete(id);
        if (result == 0){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

package com.lec.spring.controller;

import com.lec.spring.domain.Diary;
import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import com.lec.spring.repository.DiaryRepository;
import com.lec.spring.repository.HompyRepository;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.service.DiaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/cyworld/cy/diaries")
public class DiaryController {

    public final DiaryService diaryService;
    private final UserRepository userRepository;
    private final HompyRepository hompyRepository;

    public DiaryController(DiaryService diaryService, UserRepository userRepository, HompyRepository hompyRepository) {
        this.diaryService = diaryService;
        this.userRepository = userRepository;
        this.hompyRepository = hompyRepository;
    }

    @CrossOrigin
    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Diary diary) {
        try {
            Hompy hompy = hompyRepository.findById(diary.getHompy().getId())
                    .orElseThrow(() -> new RuntimeException("홈피가 없습니다."));

            User user = userRepository.findById(diary.getHompy().getUser().getId())
                    .orElseThrow(() -> new RuntimeException("유저가 없습니다."));

            diary.setHompy(hompy);  // Diary 객체에 Hompy 설정

            // Diary 저장
            Diary savedDiary = diaryService.save(diary);

            return new ResponseEntity<>(savedDiary, HttpStatus.CREATED);
        }catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @CrossOrigin
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable Long id) {
        try {
            Diary diary = diaryService.findById(id);
//            System.out.println("diary = " + diary);
            if (diary == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(diary, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @CrossOrigin
    @GetMapping("/list/{hompyId}/{userId}")
    public ResponseEntity<?> list(@PathVariable Long hompyId, @PathVariable Long userId) {
        try {
            // 특정 유저가 자신의 다이어리만 조회할 수 있도록 유저 ID 확인
            return new ResponseEntity<>(diaryService.findByList(hompyId, userId), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // 달력의 내용 출력
    @CrossOrigin
    @GetMapping("/detail-by-date/{date}")
    public ResponseEntity<?> detailByDate(@PathVariable String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);        // 날짜형식 변환
            List<Diary> diary = diaryService.findByDate(localDate);
            if (diary == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(diary, HttpStatus.OK);
        }catch (DateTimeParseException e) {
            return new ResponseEntity<>("Invalid date format", HttpStatus.BAD_REQUEST);
        }
    }

    @CrossOrigin
    @PutMapping("/update/{id}/{userId}")
    public ResponseEntity<?> update(@PathVariable Long id, @PathVariable Long userId, @RequestBody Diary diary) {
        try {
            Diary updateDiary = diaryService.update(id, diary, userId);
            System.out.println("id: " + id + " userId: " + userId + " updateDiary: " + updateDiary);
            if (updateDiary == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(diary, HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @CrossOrigin
    @DeleteMapping("/delete/{id}/{userId}")
    public ResponseEntity<?> delete(@PathVariable Long id, @PathVariable Long userId) {
        try {
            int result = diaryService.delete(id, userId);
            if (result == 0){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }
}

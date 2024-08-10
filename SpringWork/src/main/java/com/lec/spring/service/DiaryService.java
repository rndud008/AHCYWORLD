package com.lec.spring.service;

import com.lec.spring.domain.Diary;
import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import com.lec.spring.repository.DiaryRepository;
import com.lec.spring.repository.HompyRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DiaryService {
    private final HompyRepository hompyRepository;
    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;

    public DiaryService(DiaryRepository diaryRepository, HompyRepository hompyRepository, UserRepository userRepository) {
        this.diaryRepository = diaryRepository;
        this.hompyRepository = hompyRepository;
        this.userRepository = userRepository;
    }

    public Diary save(Diary diary) {
        Hompy hompy = hompyRepository.findById(diary.getHompy().getId())
                .orElseThrow(() -> new IllegalArgumentException("Hompy not found"));

        // 다이어리 작성자가 미니홈피의 소유자인지 확인
        if (!hompy.getUser().getId().equals(diary.getHompy().getUser().getId())){
            throw new IllegalArgumentException("User ID missMatch");
        }
        return diaryRepository.saveAndFlush(diary);
    }

    // 다이어리 아이디로 다이어리 찾기
    public Diary findById(Long id) {
        return diaryRepository.findById(id).orElse(null);
    }

    // 특정 유저의 미니홈피에 작성된 다이어리 목록 조회
    public List<Diary> findByList(Long hompyId, Long userId) {
        Hompy hompy = hompyRepository.findById(hompyId)
                .orElseThrow(() -> new IllegalArgumentException("미니홈피를 찾지 못함"));

        // 유저확인
        if (!hompy.getUser().getId().equals(userId)){
            throw new IllegalArgumentException("User ID missMatch");
        }

        return diaryRepository.findByHompyUserId(userId);
    }

    // 달력 안의 내용 출력
    public List<Diary> findByDate(LocalDate date) {
        return diaryRepository.findByEventDate(date);
    }

    public Diary update(Long id, Diary diary, Long userId) {
        Diary existingDiary = diaryRepository.findById(id).orElse(null);

        // 다이어리 존재 확인
        if (existingDiary != null){
            // 수정 권한 확인
            if (!existingDiary.getHompy().getUser().getId().equals(userId)){
                throw new IllegalArgumentException("수정 권한 없음");
            }
            existingDiary.setContent(diary.getContent());
            existingDiary.setKeyWord(diary.getKeyWord());
            existingDiary.setEventDate(diary.getEventDate());

            return diaryRepository.saveAndFlush(existingDiary);
        }
        return null;
    }

    public int delete(Long id, Long userId){
        int result = 0;

        Diary diary = diaryRepository.findById(id).orElse(null);

        // 다이어리 존재 확인
        if (diary != null){
            // 삭제 권한 확인
            if (!diary.getHompy().getUser().getId().equals(userId)){
                throw new IllegalArgumentException("삭제 권한 없음");
            }
            diaryRepository.delete(diary);
            result = 1;
        }

        return result;
    }
}

package com.lec.spring.service;

import com.lec.spring.domain.Diary;
import com.lec.spring.domain.Hompy;
import com.lec.spring.repository.DiaryRepository;
import com.lec.spring.repository.HompyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiaryService {
    private final HompyRepository hompyRepository;
    private final DiaryRepository diaryRepository;

    public DiaryService(DiaryRepository diaryRepository, HompyRepository hompyRepository) {
        this.diaryRepository = diaryRepository;
        this.hompyRepository = hompyRepository;
    }

    public int write(Diary diary) {
        int result = 0;
        Hompy hompy = hompyRepository.findById(diary.getHompy().getId()).orElse(null);
        if (hompy != null && hompy.getUser().getId().equals(diary.getHompy().getId())){
            diaryRepository.saveAndFlush(diary);
            result = 1;
        }
        return result;
    }

    public Diary save(Diary diary) {
        return diaryRepository.saveAndFlush(diary);
    }

    public Diary findById(Long id) {
        return diaryRepository.findById(id).orElse(null);
    }

    public List<Diary> findAll() {
        return diaryRepository.findAll();
    }

    public int update(Diary diary) {
        int result = 0;

        Diary d = diaryRepository.findById(diary.getId()).orElse(null);
        if (d != null){
            d.setContent(diary.getContent());
            d.setKeyWord(diary.getKeyWord());

            diaryRepository.saveAndFlush(d);
            result = 1;
        }
        return result;
    }

    public int delete(Long id){
        int result = 0;

        Diary diary = diaryRepository.findById(id).orElse(null);

        if (diary != null){
            diaryRepository.delete(diary);
            result = 1;
        }

        return result;
    }
}

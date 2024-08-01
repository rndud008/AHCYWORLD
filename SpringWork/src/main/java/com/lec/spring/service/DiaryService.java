package com.lec.spring.service;

import com.lec.spring.repository.DiaryRepository;
import org.springframework.stereotype.Service;

@Service
public class DiaryService {
    private DiaryRepository diaryRepository;

    public DiaryService(DiaryRepository diaryRepository) {
        this.diaryRepository = diaryRepository;
    }
}

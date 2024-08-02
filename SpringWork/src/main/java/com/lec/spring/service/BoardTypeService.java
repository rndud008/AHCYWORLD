package com.lec.spring.service;

import com.lec.spring.domain.BoardType;
import com.lec.spring.repository.BoardTypeRepository;
import org.springframework.stereotype.Service;

@Service
public class BoardTypeService {

    private final BoardTypeRepository boardTypeRepository;

    public BoardTypeService(BoardTypeRepository boardTypeRepository) {
        this.boardTypeRepository = boardTypeRepository;
    }

    public BoardType findByName(String name){
        return boardTypeRepository.findByName(name).orElse(null);
    }

}

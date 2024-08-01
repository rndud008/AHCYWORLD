package com.lec.spring.service;

import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import com.lec.spring.repository.HompyRepository;
import org.springframework.stereotype.Service;

@Service
public class HompyService {

    private final HompyRepository hompyRepository;

    public HompyService(HompyRepository hompyRepository) {
        this.hompyRepository = hompyRepository;
    }

    // 특정 User에 해당하는 Hompy 조회
    public Hompy findHompyByuser(User user) {
        return hompyRepository.findByUser(user);
    }

    // 기존 미니홈피 업데이트
    public Hompy updateHompy(Hompy hompy) {
        return hompyRepository.save(hompy);
    }

    // 프로필 사진 및 상태 메시지 업데이트
    public Hompy profile(User user, String profilePicture, String statusMessage) {
        Hompy hompy = hompyRepository.findByUser(user);
        hompy.setProfilePicture(profilePicture);
        hompy.setStatusMessage(statusMessage);
        return hompyRepository.save(hompy);
    }

    // 메뉴 상태 및 색상 설정
    public Hompy menu(User user, String menuColor, String menuStatus) {
        Hompy hompy = hompyRepository.findByUser(user);
        hompy.setMenuColor(menuColor);
        hompy.setMenuStatus(menuStatus);
        return hompyRepository.save(hompy);
    }

    // 방문자 수
    public Hompy visitCnt(User user) {
        Hompy hompy = hompyRepository.findByUser(user);
        hompy.setTodayVisitor(hompy.getTodayVisitor() + 1);
        hompy.setTotalVisitor(hompy.getTotalVisitor() + 1);
        return hompyRepository.save(hompy);
    }
}

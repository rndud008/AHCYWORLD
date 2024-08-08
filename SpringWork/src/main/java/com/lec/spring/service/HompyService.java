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

    public Hompy findById(Long id){
        return hompyRepository.findById(id).orElse(null);
    }

    // 특정 User에 해당하는 Hompy 조회
    public Hompy findHompyByuser(User user) {
        return hompyRepository.findByUser(user);
    }

    // 기존 미니홈피 업데이트
    public Hompy updateHompy(Hompy hompy) {
        return hompyRepository.save(hompy);
    }

    // 프로필 사진
    public Hompy updateProfilePicture(User user, String profilePicture) {
        Hompy hompy = hompyRepository.findByUser(user);
        if (hompy != null) {
            hompy.setProfilePicture(profilePicture);
            return hompyRepository.save(hompy);
        } else {
            throw new RuntimeException("해당 유저의 홈피를 찾을 수 없습니다.");
        }
    }

    // 상태 메시지
    public Hompy updateStatusMessage(User user, String statusMessage) {
        Hompy hompy = hompyRepository.findByUser(user);
        if (hompy != null) {
            hompy.setStatusMessage(statusMessage);
            return hompyRepository.save(hompy);
        } else {
            throw new RuntimeException("해당 유저의 홈피를 찾을 수 없습니다.");
        }
    }

    // 미니미
    public Hompy minimi(User user, String minimiPicture) {
        Hompy hompy = hompyRepository.findByUser(user);
        if (hompy != null) {
            hompy.setMinimiPicture(minimiPicture);
            return hompyRepository.save(hompy);
        } else {
            throw new RuntimeException("해당 유저의 홈피를 찾을 수 없습니다.");
        }
    }

    // 미니룸
    public Hompy miniRoom(User user, String miniRoomPicture) {
        Hompy hompy = hompyRepository.findByUser(user);
        if (hompy != null) {
            hompy.setMiniRoom(miniRoomPicture);
            return hompyRepository.save(hompy);
        } else {
            throw new RuntimeException("해당 유저의 홈피를 찾을 수 없습니다.");
        }
    }

    // 미니홈피 스킨
    public Hompy miniHompySkin(User user, String miniHompySkinPicture) {
        Hompy hompy = hompyRepository.findByUser(user);
        if (hompy != null) {
            hompy.setMiniHompySkin(miniHompySkinPicture);
            return hompyRepository.save(hompy);
        } else {
            throw new RuntimeException("해당 유저의 홈피를 찾을 수 없습니다.");
        }
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

    // 프로필 (간단한 자기소개?)
    public Hompy userProfile(User user, String profile) {
        Hompy hompy = hompyRepository.findByUser(user);
        if (hompy != null) {
            hompy.setProfile(profile);
            return hompyRepository.save(hompy);
        } else {
            throw new RuntimeException("해당 유저의 홈피를 찾을 수 없습니다.");
        }
    }
}

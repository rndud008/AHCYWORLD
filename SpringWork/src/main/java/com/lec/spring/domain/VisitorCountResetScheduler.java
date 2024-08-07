package com.lec.spring.domain;

import com.lec.spring.repository.HompyRepository;
import com.lec.spring.service.HompyService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class VisitorCountResetScheduler {

    private final HompyRepository hompyRepository;

    public VisitorCountResetScheduler(HompyRepository hompyRepository) {
        this.hompyRepository = hompyRepository;
    }

    // 매일 00시에 당일 방문자 수 초기화
    @Scheduled(cron = "0 0 0 * * *")
    public void resetTodayVisitor() {
        // 모든 Hompy 엔티티 가져오기
        List<Hompy> hompyList = hompyRepository.findAll();

        // 각 hompy 엔티티의 todayVisitor를 0으로 초기화
        for (Hompy hompy : hompyList) {
            hompy.setTodayVisitor(0L);
        }

        // 초기화된 hompy 엔티티들을 저장
        hompyRepository.saveAll(hompyList);
    }
}

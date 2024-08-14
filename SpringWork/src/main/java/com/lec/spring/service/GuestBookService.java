package com.lec.spring.service;

import com.lec.spring.domain.GuestBook;
import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import com.lec.spring.repository.FriendRepository;
import com.lec.spring.repository.GuestBookRepository;
import com.lec.spring.repository.HompyRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GuestBookService {

    private final GuestBookRepository guestBookRepository;
    private final UserRepository userRepository;
    private final HompyRepository hompyRepository;
    private final FriendRepository friendRepository;

    public GuestBookService(GuestBookRepository guestBookRepository, UserRepository userRepository, HompyRepository hompyRepository, FriendRepository friendRepository) {
        this.guestBookRepository = guestBookRepository;
        this.userRepository = userRepository;
        this.hompyRepository = hompyRepository;
        this.friendRepository = friendRepository;
    }

    // 일촌 관계일 때만 글 작성 가능
    public GuestBook save(GuestBook guestBook) {
        User guestBookUser = userRepository.findById(guestBook.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Hompy targetHompy = hompyRepository.findById(guestBook.getHompy().getId())
                .orElseThrow(() -> new IllegalArgumentException("미니홈피를 찾지 못 했습니다."));

        // 로그에 방명록 작성자와 홈피 소유자 정보를 출력
        System.out.println("GuestBook User: " + guestBookUser.getId() + ", Hompy Owner: " + targetHompy.getUser().getId());
        System.out.println("Hompy Owner: " + targetHompy);

        if (!friendRepository.existsByUserAndFriendUser(guestBookUser, targetHompy.getUser())) {
            throw new IllegalArgumentException("유저와 일촌 관계가 아닙니다.");
        }

        if (guestBook.getGuestBookName() == null) {
            guestBook.setGuestBookName("guestBook");
        }

        return guestBookRepository.save(guestBook);
    }

    public GuestBook findById(Long id) {
        return guestBookRepository.findById(id).orElse(null);
    }

    // 작성자와 미니홈피 주인만 삭제 가능
    public int delete(Long id, String username) {
        GuestBook guestBook = guestBookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("방명록을 찾지 못 했습니다."));
        User user = userRepository.findByUsername(username);

        if (guestBook.getUser().equals(user) || guestBook.getHompy().getUser().equals(user)) {
            guestBookRepository.delete(guestBook);
            return 1;
        } else {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }
    }

    // 작성자와 미니홈피 주인만 방명록 볼 수 있는 로직
    public List<GuestBook> findByHompyAndVisibility(Long hompyId, String username, String action) {     //
        Hompy hompy = hompyRepository.findById(hompyId)
                .orElseThrow(() -> new IllegalArgumentException("미니홈피를 찾지 못 했습니다."));
        User user = userRepository.findByUsername(username);

        System.out.println("hompy:" + hompy);
        System.out.println("user:" + user);

        if (action.equals("friendReview")) {
            return guestBookRepository.findByHompyIdAndGuestBookNameOrderByIdDesc(hompyId, action);
        } else if (action.equals("null")) {

            return guestBookRepository.findByHompyIdAndGuestBookNameOrderByIdDesc(hompyId, "guestBook");
        }

        return null;
    }

    // 비밀글 설정
    public GuestBook hideGuestBook(Long id, String username) {
        GuestBook guestBook = guestBookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("방명록을 찾지 못 했습니다."));
        User user = userRepository.findByUsername(username);

        if (guestBook.getUser().equals(user) || guestBook.getHompy().getUser().equals(user)) {
            guestBook.setStatus("invisible");
            return guestBookRepository.save(guestBook);
        } else {
            throw new IllegalArgumentException("비밀글로 설정할 권한이 없습니다.");
        }
    }

    public boolean isFriend(Long homypId, String username) {
        User user = userRepository.findByUsername(username);
        Hompy hompy = hompyRepository.findById(homypId)
                .orElseThrow(() -> new IllegalArgumentException("미니홈피를 찾지 못 했습니다."));

        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }
        return friendRepository.existsByUserAndFriendUser(user, hompy.getUser());
    }

    public Hompy findHompyByUserId(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            return hompyRepository.findByUser(user);
        }
        return null;
    }
}

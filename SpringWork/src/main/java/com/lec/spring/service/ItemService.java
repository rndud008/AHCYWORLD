package com.lec.spring.service;

import com.lec.spring.domain.Item;
import com.lec.spring.domain.Pagenation;
import com.lec.spring.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ItemService {
    @Value("10")
    private int WRITE_PAGE;

    @Value("15")
    private int PAGE_ROWS;

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Transactional
    public Item save(Item item) {
        return itemRepository.saveAndFlush(item);
    }

    @Transactional(readOnly = true)
    public Pagenation list(Integer page, String url, String type) {
        Pagenation pagenation = new Pagenation();
        Page<Item> itemPage;

        //현재 페이지
        if (page == null || page < -1) page = 1;

        if (type.equals("all")) {
            itemPage = itemRepository.findAll(PageRequest.of(page - 1, PAGE_ROWS, Sort.by(Sort.Order.desc("id"))));

        } else {
            itemPage = itemRepository.findByItemType(type, PageRequest.of(page - 1, PAGE_ROWS, Sort.by(Sort.Order.desc("id"))));
        }

        long cnt = itemPage.getTotalElements();
        int totalPage = itemPage.getTotalPages();

        int startPage = 0;
        int endPage = 0;

        List<Item> list = null;

        if (cnt > 0) {
            if (page > totalPage) page = totalPage;
            startPage = (((page - 1) / WRITE_PAGE) * WRITE_PAGE) + 1;
            endPage = startPage + WRITE_PAGE - 1;
            if (endPage >= totalPage) endPage = totalPage;

            list = itemPage.getContent();

        } else {
            page = 0;
        }

        return pagenation.builder()
                .cnt(cnt)
                .totalPage(totalPage)
                .writepages(WRITE_PAGE)
                .pagerows(PAGE_ROWS)
                .page(page)
                .startpage(startPage)
                .endpage(endPage)
                .items(list)
                .url(url)
                .build();
    }

}

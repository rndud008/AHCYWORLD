package com.lec.spring.service;

import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.SearchListDTO;
import com.lec.spring.domain.User;
import com.lec.spring.repository.HompyRepository;
import com.lec.spring.repository.ItemRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {
    private final HompyRepository hompyRepository;
    private final ItemRepository itemRepository;

    public SearchService(HompyRepository hompyRepository, ItemRepository itemRepository) {
        this.hompyRepository = hompyRepository;
        this.itemRepository = itemRepository;
    }

    public SearchListDTO searchUserList(String name) {
        List<Hompy> hompyList = new ArrayList<>();

        if (!name.isEmpty() || !name.trim().isEmpty()) {
            hompyList = hompyRepository.findByUserNameContainingIgnoreCase(name).orElse(null);
        } else {
            hompyList = hompyRepository.findAll();
        }

        if (hompyList.isEmpty()) {
            throw new RuntimeException("검색기록이 없습니다.");
        }

        SearchListDTO searchListDTO = new SearchListDTO();

        searchListDTO.setHompyList(hompyList);

        return searchListDTO;
    }

    public SearchListDTO searchItemList(String itemName) {
        List<Item> itemBgmList = new ArrayList<>();
        List<Item> itemAllList = new ArrayList<>();
        List<Item> itemList = new ArrayList<>();

        if (!itemName.isEmpty() || !itemName.trim().isEmpty()) {
            itemBgmList = itemRepository.findByItemTypeNotAndItemNameContainingIgnoreCaseAndStatus("배경음악", itemName, "visible").orElse(null);
            itemAllList = itemRepository.findByItemTypeAndStatusAndItemNameOrSourceName("배경음악", itemName, "visible").orElse(null);
        } else {
            itemList = itemRepository.findAll();
        }

        if (itemAllList.isEmpty() && itemBgmList.isEmpty() && itemList.isEmpty()) {
            throw new RuntimeException("검색기록이 없습니다.");
        }

        if (!itemAllList.isEmpty()) {
            itemList.addAll(itemAllList);
        }

        if (!itemBgmList.isEmpty()) {
            itemList.addAll(itemBgmList);
        }

        SearchListDTO searchListDTO = new SearchListDTO();
        searchListDTO.setItemList(itemList);

        return searchListDTO;

    }

    public SearchListDTO searchAllList(String allItemNameAndName) {
        List<Hompy> hompyList = new ArrayList<>();

        if (!allItemNameAndName.isEmpty() || !allItemNameAndName.trim().isEmpty()) {
            hompyList = hompyRepository.findByUserNameContainingIgnoreCase(allItemNameAndName).orElse(null);
        } else {
            hompyList = hompyRepository.findAll();
        }

        List<Item> itemBgmList = new ArrayList<>();
        List<Item> itemAllList = new ArrayList<>();
        List<Item> itemList = new ArrayList<>();

        if (!allItemNameAndName.isEmpty() || !allItemNameAndName.trim().isEmpty()) {
            itemBgmList = itemRepository.findByItemTypeNotAndItemNameContainingIgnoreCaseAndStatus("배경음악", allItemNameAndName, "visible").orElse(null);
            itemAllList = itemRepository.findByItemTypeAndStatusAndItemNameOrSourceName("배경음악", allItemNameAndName, "visible").orElse(null);
        } else {
            itemList = itemRepository.findAll();
        }

        if (itemAllList.isEmpty() && itemBgmList.isEmpty() && itemList.isEmpty()) {
            throw new RuntimeException("검색기록이 없습니다.");
        }

        if (!itemAllList.isEmpty()) {
            itemList.addAll(itemAllList);
        }

        if (!itemBgmList.isEmpty()) {
            itemList.addAll(itemBgmList);
        }

        if (itemList.isEmpty() && hompyList.isEmpty()) {
            throw new RuntimeException("검색기록이 없습니다.");
        }

        itemList = itemList.isEmpty() ? null : itemList;
        hompyList = hompyList.isEmpty() ? null : hompyList;

        SearchListDTO searchListDTO = new SearchListDTO();

        searchListDTO.setItemList(itemList);
        searchListDTO.setHompyList(hompyList);

        return searchListDTO;

    }

}

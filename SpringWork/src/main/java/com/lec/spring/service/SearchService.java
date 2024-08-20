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

    public SearchListDTO searchUserList(String name){
        List<Hompy> hompyList = hompyRepository.findByUserNameContainingIgnoreCase(name).orElse(null);

        if( hompyList.isEmpty()){
            throw new RuntimeException("검색기록이 없습니다.");
        }

        SearchListDTO searchListDTO = new SearchListDTO();

        searchListDTO.setHompyList(hompyList);

        return searchListDTO;
    }

    public SearchListDTO searchItemList(String itemName){
        List<Item> itemBgmList = itemRepository.findByItemTypeNotAndItemNameContainingIgnoreCaseAndStatus("배경음악",itemName,"visible").orElse(null);
        List<Item> itemAllList = itemRepository.findByItemTypeAndStatusAndItemNameOrSourceName("배경음악",itemName,"visible").orElse(null);

        List<Item> itemList = new ArrayList<>();


            if( itemAllList.isEmpty() && itemBgmList.isEmpty()){
                throw new RuntimeException("검색기록이 없습니다.");
            }

            if (!itemAllList.isEmpty()){
                itemList.addAll(itemAllList);
            }

            if (!itemBgmList.isEmpty()){
                itemList.addAll(itemBgmList);
        }

        SearchListDTO searchListDTO = new SearchListDTO();
        searchListDTO.setItemList(itemList);

        return searchListDTO;

    }

    public SearchListDTO searchAllList(String allItemNameAndName){

        List<Hompy> hompyList = hompyRepository.findByUserNameContainingIgnoreCase(allItemNameAndName).orElse(null);

        List<Item> itemBgmList = itemRepository.findByItemTypeNotAndItemNameContainingIgnoreCaseAndStatus("배경음악",allItemNameAndName,"visible").orElse(null);
        List<Item> itemAllList = itemRepository.findByItemTypeAndStatusAndItemNameOrSourceName("배경음악",allItemNameAndName,"visible").orElse(null);

        List<Item> itemList = new ArrayList<>();

        SearchListDTO searchListDTO = new SearchListDTO();

        if (!itemAllList.isEmpty()){
            itemList.addAll(itemAllList);
        }

        if (!itemBgmList.isEmpty()){
            itemList.addAll(itemBgmList);
        }

        if(itemList.isEmpty() && hompyList.isEmpty()){
            throw new RuntimeException("검색기록이 없습니다.");
        }

        itemList = itemList.isEmpty()? null: itemList;
        hompyList = hompyList.isEmpty()? null: hompyList;

        searchListDTO.setItemList(itemList);
        searchListDTO.setHompyList(hompyList);

        return searchListDTO;

    }

}

package com.lec.spring.service;

import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.SearchListDTO;
import com.lec.spring.domain.User;
import com.lec.spring.repository.HompyRepository;
import com.lec.spring.repository.ItemRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.stereotype.Service;

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
        List<Item> itemList = itemRepository.findByItemNameContainingIgnoreCaseAndStatus(itemName,"visible").orElse(null);

        if( itemList.isEmpty()){
            throw new RuntimeException("검색기록이 없습니다.");
        }

        SearchListDTO searchListDTO = new SearchListDTO();
        searchListDTO.setItemList(itemList);

        return searchListDTO;

    }

    public SearchListDTO searchAllList(String allItemNameAndName){

        List<Hompy> hompyList = hompyRepository.findByUserNameContainingIgnoreCase(allItemNameAndName).orElse(null);

        List<Item> itemList = itemRepository.findByItemNameContainingIgnoreCaseAndStatus(allItemNameAndName,"visible").orElse(null);

        SearchListDTO searchListDTO = new SearchListDTO();

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

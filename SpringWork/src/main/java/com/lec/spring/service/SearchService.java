package com.lec.spring.service;

import com.lec.spring.domain.Item;
import com.lec.spring.domain.SearchListDTO;
import com.lec.spring.domain.User;
import com.lec.spring.repository.ItemRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    public SearchService(UserRepository userRepository, ItemRepository itemRepository) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
    }

    public SearchListDTO searchUserList(String name){
        List<User> userList = userRepository.findByNameContainingIgnoreCase(name).orElse(null);

        if( userList == null){
            throw new RuntimeException("검색기록이 없습니다.");
        }

        SearchListDTO searchListDTO = new SearchListDTO();

        searchListDTO.setUserList(userList);

        return searchListDTO;
    }

    public SearchListDTO searchItemList(String itemName){
        List<Item> itemList = itemRepository.findByItemNameContainingIgnoreCase(itemName).orElse(null);

        if( itemList == null){
            throw new RuntimeException("검색기록이 없습니다.");
        }

        SearchListDTO searchListDTO = new SearchListDTO();
        searchListDTO.setItemList(itemList);

        return searchListDTO;

    }

    public SearchListDTO searchAllList(String allItemNameAndName){

        List<User> userList = userRepository.findByNameContainingIgnoreCase(allItemNameAndName).orElse(null);

        List<Item> itemList = itemRepository.findByItemNameContainingIgnoreCase(allItemNameAndName).orElse(null);

        SearchListDTO searchListDTO = new SearchListDTO();

        searchListDTO.setItemList(itemList);
        searchListDTO.setUserList(userList);

        return searchListDTO;

    }

}

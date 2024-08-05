package com.lec.spring.service;

import com.lec.spring.domain.Item;
import com.lec.spring.repository.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Transactional
    public Item save(Item item) {
        return itemRepository.saveAndFlush(item);
    }

    @Transactional
    public List<Item> list(String type){
        return itemRepository.findByItemType(type);
    }

}

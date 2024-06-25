package com.nz.letschat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.nz.letschat.model.Chat;
import com.nz.letschat.repository.ChatRepository;

@RestController
public class ChatController {
    @Autowired
    ChatRepository chatRepository;

    @PostMapping("/addChat")
    public void addChat(@RequestBody Chat chat){
        chatRepository.save(chat);
    }
}

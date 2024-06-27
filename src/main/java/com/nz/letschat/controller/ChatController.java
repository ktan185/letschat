package com.nz.letschat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.nz.letschat.model.Chat;
import com.nz.letschat.repository.ChatRepository;
import com.nz.letschat.model.Chat.ChatID;

@RestController
public class ChatController {
    @Autowired
    ChatRepository chatRepository;

    @PostMapping("/addChat")
    public ResponseEntity<?> addChat(@RequestBody Chat chat) {
        if (chatRepository.existsByChatID(chat.getChatID())) {
            return ResponseEntity.badRequest().body("Chat Already Exists Under: " + chat.getChatID());
        }

        try {
            chatRepository.save(chat);
            return ResponseEntity.ok(chat);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/chats")
    public ResponseEntity<List<Chat>> getAllChats() {
        try {
            List<Chat> allChats = chatRepository.findAll();
            return ResponseEntity.ok(allChats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

    }

    @GetMapping("/chat")
    public ResponseEntity<?> getChat(@RequestParam String ownerEmailAddress, @RequestParam String uniqueChatID){
        try{
            ChatID chatID=new ChatID(ownerEmailAddress,uniqueChatID);
            if (!chatRepository.existsByChatID(chatID)) {
                return ResponseEntity.badRequest().body("Chat Dosen't Exist!");
            }
            Chat chat=chatRepository.findOneByChatID(chatID);
            return ResponseEntity.ok(chat);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e);
        }
    }
}

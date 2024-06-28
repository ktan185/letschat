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
import com.nz.letschat.model.Chat.ChatID;
import com.nz.letschat.repository.ChatRepository;

@RestController
public class ChatController {
    @Autowired
    ChatRepository chatRepository;

    @PostMapping("/api/addChat")
    public ResponseEntity<?> addChat(@RequestBody String chatName, @RequestParam String userToken) {

        try {
            Chat chat = new Chat(chatName, userToken);
            chatRepository.save(chat);
            return ResponseEntity.ok(chat);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/api/getAllChats")
    public ResponseEntity<List<Chat>> getAllChats() {
        try {
            List<Chat> allChats = chatRepository.findAll();
            return ResponseEntity.ok(allChats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

    }

     @GetMapping("/chat")
    public ResponseEntity<?> getChat(@RequestParam String ownerToken, @RequestParam String uniqueChatID){
        try{
            ChatID chatID = new ChatID(ownerToken,uniqueChatID);
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

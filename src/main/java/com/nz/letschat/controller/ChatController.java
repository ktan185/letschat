package com.nz.letschat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

import com.nz.letschat.model.Message;
import com.nz.letschat.model.chatModels.Chat;
import com.nz.letschat.model.chatModels.Chat.ChatID;
import com.nz.letschat.repository.ChatRepository;
import com.nz.letschat.service.ChatService;

@RestController
public class ChatController {
    @Autowired
    ChatRepository chatRepository;
    @Autowired
    ChatService chatService;

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

    @GetMapping("/api/getAllChatMessages")
    public ResponseEntity<?> getAllChatMessages(@RequestParam String ownerToken, @RequestParam String uniqueChatID) {
        try {
            ChatID chatID = new ChatID(ownerToken, uniqueChatID);
            Chat chat = chatRepository.findOneByChatID(chatID);
            List<Message> list = chat.getChatMessages();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e);
        }
    }

    @GetMapping("/api/getChatMessageRange")
    public ResponseEntity<?> getChatMessageRange(@RequestParam String ownerToken, @RequestParam String uniqueChatID,
            @RequestParam String lowerBoundInclusive, @RequestParam String upperBoundExclusive) {
        try {

            int lb = Integer.parseInt(lowerBoundInclusive);
            int ub = Integer.parseInt(upperBoundExclusive);

            return chatService.getSubMessages(ownerToken, uniqueChatID, lb, ub);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e);
        }
    }

    @GetMapping("/chat")
    public ResponseEntity<?> getChat(@RequestParam String ownerToken, @RequestParam String uniqueChatID) {
        try {
            ChatID chatID = new ChatID(ownerToken, uniqueChatID);
            if (!chatRepository.existsByChatID(chatID)) {
                return ResponseEntity.badRequest().body("Chat Dosen't Exist!");
            }
            Chat chat = chatRepository.findOneByChatID(chatID);
            return ResponseEntity.ok(chat);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e);
        }
    }

}

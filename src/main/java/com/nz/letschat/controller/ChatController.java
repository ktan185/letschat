package com.nz.letschat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import com.nz.letschat.model.Message;
import com.nz.letschat.model.chatModels.Chat;
import com.nz.letschat.model.chatModels.Chat.ChatID;
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

    @DeleteMapping("/api/deleteChat")
    public ResponseEntity<?> deleteChat(@RequestParam String token, @RequestParam String uniqueChatID){
        try{
            ChatID chatID=new ChatID(token,uniqueChatID);
            if(!chatRepository.existsByChatID(chatID)){
                return ResponseEntity.badRequest().body("Error wrong user token and unique chat ID");
            }
            chatRepository.deleteOneByChatID(chatID);
            return ResponseEntity.ok("Successfully Deleted");
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e);
        }
    }

}

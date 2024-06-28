package com.nz.letschat.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Chat {
    
    public Chat(String chatName, String userToken) {
        this.chatName = chatName;
        String uuid = UUID.randomUUID().toString();
        this.setChatID(new ChatID(userToken, uuid.substring(uuid.length() - 10))); 
    }

    @Id
    ChatID chatID;

    String chatName;

    String[] chatMessages;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChatID {

        String ownerToken;

        String uniqueChatID;
    }
}

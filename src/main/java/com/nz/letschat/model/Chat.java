package com.nz.letschat.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
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
        this.chatMessages=new ArrayList<Message>();
    }

    @Id
    ChatID chatID;

    String chatName;

    List<Message> chatMessages;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChatID {

        String ownerToken;

        String uniqueChatID;
    }
}

package com.nz.letschat.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Chat {
    @Id
    ChatID chatID;

    String chatName;

    String[] chatMessages;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChatID{

        String ownerEmailAddress;

        String uniqueChatID;
    }
}

package com.nz.letschat.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.nz.letschat.model.chatModels.Chat;
import com.nz.letschat.model.chatModels.Chat.ChatID;

public interface ChatRepository extends MongoRepository<Chat, String> {
    

    public List<Chat> findAll();

    public boolean existsByChatID(ChatID chatID);

    public Chat findOneByChatID(ChatID chatID);

    public void deleteOneByChatID(ChatID chatID);
}

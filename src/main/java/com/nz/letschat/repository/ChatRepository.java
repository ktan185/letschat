package com.nz.letschat.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.nz.letschat.model.Chat;
import com.nz.letschat.model.Chat.ChatID;

public interface ChatRepository extends MongoRepository<Chat,String>{
    public List<Chat> findAll();
    public boolean existsByChatID(ChatID chatID);
    public Chat findOneByChatID(ChatID chatID);
}

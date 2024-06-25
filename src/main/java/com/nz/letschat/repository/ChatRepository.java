package com.nz.letschat.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.nz.letschat.model.Chat;

public interface ChatRepository extends MongoRepository<Chat,String>{
    public List<Chat> findAll();
    public boolean findChatByChatIDExists(String ownerEmailAddress,String uniqueChatID);
}

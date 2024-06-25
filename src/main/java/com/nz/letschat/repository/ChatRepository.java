package com.nz.letschat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.nz.letschat.model.Chat;

public interface ChatRepository extends MongoRepository<Chat,String>{
    
}

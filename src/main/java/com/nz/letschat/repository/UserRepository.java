package com.nz.letschat.repository;


import com.nz.letschat.model.Chat.ChatID;
import com.nz.letschat.model.User;

import org.springframework.data.mongodb.repository.MongoRepository;


public interface UserRepository extends MongoRepository<User,ChatID> {
	
}

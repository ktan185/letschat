package com.nz.letschat.repository;

import com.nz.letschat.model.User;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User,String> {
  
  public List<User> findAll();

}

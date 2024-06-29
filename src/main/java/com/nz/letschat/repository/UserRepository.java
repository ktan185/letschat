package com.nz.letschat.repository;

import com.nz.letschat.model.User;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User,String> {
  
  @SuppressWarnings("null")
  public List<User> findAll();

  public User findUserByEmail(String email);

  public User findUserByUserName(String userName);

}

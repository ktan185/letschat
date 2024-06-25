package com.nz.letschat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.nz.letschat.model.User;
import com.nz.letschat.repository.UserRepository;

@RestController
public class UserController {
    @Autowired
    UserRepository personRepository;

    @PostMapping("/addUser")
    public void addPerson(@RequestBody User person){
        personRepository.save(person);
    }
}

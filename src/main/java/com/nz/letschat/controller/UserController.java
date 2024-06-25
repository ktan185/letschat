package com.nz.letschat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.nz.letschat.model.User;
import com.nz.letschat.repository.UserRepository;
import com.nz.letschat.service.UserService;

@RestController
public class UserController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @PostMapping("/signup")
    public ResponseEntity createUser(@RequestBody User newUser) {

        // format userName and email first 
        userService.formatUserInfo(newUser);
        // Then check to see if the userName and email is unique
        if (!userService.checkUniqueUserNameAndEmail(newUser)) {
            return ResponseEntity.status(500).build();
        }

        try {
            // encrypt user password before storing.
            userService.createEncryptedUser(newUser);
            userRepository.save(newUser);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
           return ResponseEntity.badRequest().build(); 
        }
        
    }

}

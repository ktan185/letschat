package com.nz.letschat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

    /**
     * 
     * @param newUser is the payload from frontend client which needs to
     * be validated before we can accept the sign up. This includes ensuring
     * that the username and email are unique, lowercased and stripped of 
     * white space, as well that the email address is valid.
     * @return status 200 if a sign up is successful.
     */
    @PostMapping("/signUp")
    public ResponseEntity<?> createUser(@RequestBody User newUser) {

        if (!userService.validateUserDetails(newUser)) {
            return ResponseEntity
            .status(HttpStatus.NOT_ACCEPTABLE)
            .body("One of the form fields is missing!");
        }

        if (!userService.checkValidEmailAddress(newUser)) {
            return ResponseEntity
                .status(HttpStatus.NOT_ACCEPTABLE)
                .body("Email address is invalid!");
        }

        // format userName and email. 
        userService.formatUserInfo(newUser);
        // Then check to see if the userName and email is unique
        if (!userService.checkUniqueUserNameAndEmail(newUser)) {
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body("Username or email has been taken!");
        }

        try {
            // encrypt user password before storing.
            userService.createEncryptedUser(newUser);
            userRepository.save(newUser);
            return ResponseEntity.ok("You have successfully signed up!");
        } catch (Exception e) {
           return ResponseEntity.badRequest().build(); 
        }
    }

    /**
     * 
     * @param user is a payload containing either the submitted (email, password) 
     * or (userName, password) as we will allow users to login to the application 
     * with either their username or email. Given this, one of the fields will be
     * null! - this will be validated in doesUserExist().
     * @return status 200 if successful login occured.
     */ 
    @PostMapping("/signIn")
    public ResponseEntity<?> signUserIn(@RequestBody User user) {
        if (!userService.checkPassword(user)) {
            return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body("Username, email or password is incorrect!");
        }
        User profile = userService.getUserProfileWithoutPassword(user);
        return ResponseEntity.ok(profile);
    }
}

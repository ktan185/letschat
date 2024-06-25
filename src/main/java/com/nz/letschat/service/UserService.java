package com.nz.letschat.service;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.nz.letschat.model.User;
import com.nz.letschat.repository.UserRepository;

@Service
public class UserService {

  @Autowired
  UserRepository userRepository;
  
  public void createEncryptedUser(User user) {
    user.setPassword(encryptPassword(user));
  }

  public void formatUserInfo(User user) {
    String userName = user.getUserName();
    String userEmail = user.getEmail();

    // Strip the strings of trailing whitespate + lowercase them.
    String strippedUserName = stripWhiteSpaceAndLowerCase(userName);
    String strippedEmail = stripWhiteSpaceAndLowerCase(userEmail);
    user.setEmail(strippedEmail);
    user.setUserName(strippedUserName);
  }

  private String encryptPassword(User user) {
    String curPwd = user.getPassword();
    String salt = BCrypt.gensalt(10);
    String encryptedPwd = BCrypt.hashpw(curPwd, salt);
    return encryptedPwd;
  }

  private String stripWhiteSpaceAndLowerCase(String s) {
    return s.trim().toLowerCase();
  }

  public boolean checkUniqueUserNameAndEmail(User user) {
    String curUserName = user.getUserName();
    String curEmail = user.getEmail();
    List<User> existingUsers = userRepository.findAll();
    // Check that the current email or username has not been taken.
    return existingUsers.parallelStream().noneMatch(existingUser -> 
      existingUser.getEmail().equals(curEmail) || existingUser.getUserName().equals(curUserName)
    );
  }

}

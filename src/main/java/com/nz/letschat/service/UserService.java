package com.nz.letschat.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.nz.letschat.Utils.EmailValidator;
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

  public boolean checkPassword(User attemptedLogin) {
    User existingUserToCheck = getUserProfile(attemptedLogin);
    String pwdToCheck = attemptedLogin.getPassword();
    
    // If there's no record of the user in our database, return false.
    if (existingUserToCheck == null) {
      return false;
    }
    String hashedPwd = existingUserToCheck.getPassword();
    return BCrypt.checkpw(pwdToCheck, hashedPwd);
  }

  public User getUserProfile(User user) {
    String userName = stripWhiteSpaceAndLowerCase(user.getUserName()); 
    String userEmail = stripWhiteSpaceAndLowerCase(user.getEmail());
    User curUser = null;
    // we allow users to login with either email or username, thus one field of 
    // The payload will be null and we decide how to query based on present field.
    if (userName == null) {
      curUser = userRepository.findUserByEmail(userEmail);
    } else if (userEmail == null) {
      curUser = userRepository.findUserByUserName(userName);
    }
    return curUser;
  }
  
  public User getUserProfileWithoutPassword(User user) {
    User curUser = getUserProfile(user);
    User clientProfile = curUser.clone();
    clientProfile.setPassword(null);
    return clientProfile;
  }

  public boolean validateUserDetails(User user) {
    List<String> userFields = Arrays.asList(
      user.getEmail(),
      user.getFirstName(),
      user.getLastName(),
      user.getPassword(),
      user.getUserName() 
    );
    return userFields.stream().allMatch(field -> field != null);
  }

  public boolean checkUniqueUserNameAndEmail(User user) {
    String curUserName = user.getUserName();
    String curEmail = user.getEmail();
    List<User> existingUsers = userRepository.findAll();
    // Check that the current email or username has not been taken.
    return existingUsers.parallelStream().noneMatch(existingUser -> 
      existingUser.getEmail().equals(curEmail) 
      || existingUser.getUserName().equals(curUserName)
    );
  }

  public boolean checkValidEmailAddress(User user) {
    String emailToCheck = user.getEmail();
    return EmailValidator.isEmailValid(emailToCheck);
  }
    
  private String encryptPassword(User user) {
    String curPwd = user.getPassword();
    String salt = BCrypt.gensalt(10);
    String encryptedPwd = BCrypt.hashpw(curPwd, salt);
    return encryptedPwd;
  }

  private String stripWhiteSpaceAndLowerCase(String s) {
    if (s == null) {
      return null;
    }
    return s.trim().toLowerCase();
  }
}

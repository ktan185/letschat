package com.nz.letschat.Utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class EmailValidator {

  private static String emailPattern = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^-]+(?:\\.[a-zA-Z0-9_!#$%&'*+/=?`{|}~^-]+)*@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$";
  private static Pattern pattern = Pattern.compile(emailPattern);

  public static boolean isEmailValid(String email) {
    Matcher matcher = pattern.matcher(email);
    return matcher.matches();
  }
}

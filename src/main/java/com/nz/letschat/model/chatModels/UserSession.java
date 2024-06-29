package com.nz.letschat.model.chatModels;
import com.nz.letschat.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSession {
    User user;
    String sessionID;
}

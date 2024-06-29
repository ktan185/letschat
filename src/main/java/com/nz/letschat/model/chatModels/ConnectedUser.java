package com.nz.letschat.model.chatModels;

import com.nz.letschat.model.User;
import com.nz.letschat.model.chatModels.Chat.ChatID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConnectedUser {

    private User user;
    private ChatID chatID;
}

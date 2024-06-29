package com.nz.letschat.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.nz.letschat.model.Message;
import com.nz.letschat.model.User;
import com.nz.letschat.model.chatModels.Chat;
import com.nz.letschat.model.chatModels.ConnectedUser;
import com.nz.letschat.model.chatModels.Chat.ChatID;
import com.nz.letschat.repository.ChatRepository;

@Service
public class ChatService {
    @Autowired
    ChatRepository chatRepository;
    private final Map<ChatID, Set<User>> chatToUserMap = new HashMap<ChatID, Set<User>>();
    private final Map<String, ConnectedUser> sessionToConnectedUser = new HashMap<String, ConnectedUser>();

    public Set<User> addUser(ConnectedUser connectedUser, String sessionId) {
        ChatID chatID = connectedUser.getChatID();
        User user = connectedUser.getUser();
        Set<User> userSet = chatToUserMap.getOrDefault(chatID, new HashSet<User>());
        sessionToConnectedUser.put(sessionId, connectedUser);
        userSet.add(user);
        chatToUserMap.put(chatID, userSet);

        return userSet;
    }

    public Set<User> decrementUsers(String sessionId) {
        if (!sessionToConnectedUser.containsKey(sessionId)) {
            return new HashSet<User>();
        }
        ConnectedUser connectedUser = sessionToConnectedUser.get(sessionId);

        ChatID chatID = connectedUser.getChatID();
        User user = connectedUser.getUser();

        Set<User> userSet = chatToUserMap.getOrDefault(chatID, new HashSet<User>());

        sessionToConnectedUser.remove(sessionId);
        userSet.remove(user);

        if (userSet.isEmpty()) {
            chatToUserMap.remove(chatID);
        }

        return userSet;
    }

    public int getNumUsers(ChatID chatID) {
        Set<User> userSet = chatToUserMap.getOrDefault(chatID, new HashSet<User>());
        int numUsers = userSet.size();
        return numUsers;
    }

    public Set<User> getUsers(ChatID chatID) {
        Set<User> userSet = chatToUserMap.getOrDefault(chatID, new HashSet<User>());
        return userSet;
    }

    public ConnectedUser getConnectedUser(String sessionID) {
        ConnectedUser connectedUser = sessionToConnectedUser.get(sessionID);
        return connectedUser;
    }

    public void getChatAndUpdateMessages(Message message) {
        String ownerToken = message.getOwnerToken();
        String uniqueChatID = message.getUniqueChatID();
        ChatID chatId = new ChatID(ownerToken, uniqueChatID);
        Chat chat = chatRepository.findOneByChatID(chatId);
        List<Message> list = chat.getChatMessages();
        list.add(message);
        chatRepository.save(chat);
    }

    public ResponseEntity<?> getSubMessages(String ownerToken, String uniqueChatID, int lb, int ub) {

        if (ub <= lb) {
            return ResponseEntity.badRequest().body("UpperBound cant be less than the lowerbound search range");
        }
        ChatID chatID = new ChatID(ownerToken, uniqueChatID);
        Chat chat = chatRepository.findOneByChatID(chatID);
        List<Message> chatMessages = chat.getChatMessages();

        if (lb >= chatMessages.size()) {
            return ResponseEntity.ok(new ArrayList<Message>());
        } else if (ub > chatMessages.size()) {
            ub = chatMessages.size();
        }

        List<Message> subChatMessages = chatMessages.subList(lb, ub);

        return ResponseEntity.ok(subChatMessages);
    }
}

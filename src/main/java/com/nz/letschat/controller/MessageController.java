package com.nz.letschat.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.nz.letschat.model.Message;
import com.nz.letschat.model.User;
import com.nz.letschat.model.chatModels.ConnectedUser;
import com.nz.letschat.model.chatModels.Chat.ChatID;
import com.nz.letschat.service.ChatService;

@Controller

public class MessageController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    ChatService chatService;

    @MessageMapping("/chat")
    public void send(@Payload Message message) throws Exception {
        String ownerToken = message.getOwnerToken();
        String uniqueChatID = message.getUniqueChatID();
        String time = new SimpleDateFormat("HH:mm").format(new Date());
        message.setTime(time);
        simpMessagingTemplate.convertAndSend("/topic/messages/" + ownerToken + uniqueChatID, message);
        chatService.getChatAndUpdateMessages(message);
    }


    @MessageMapping("/connected")
    public void handleConnection(@Payload ConnectedUser connectedUser, SimpMessageHeaderAccessor headerAccessor) throws Exception {
        ChatID chatID=connectedUser.getChatID();
        String ownerToken=chatID.getOwnerToken();
        String uniqueChatID=chatID.getUniqueChatID();
        String sessionID=headerAccessor.getSessionId();

        Set<User> userSet=chatService.addUser(connectedUser,sessionID);
        int numUsers=chatService.getNumUsers(chatID);
        simpMessagingTemplate.convertAndSend("/topic/connected/" + ownerToken + uniqueChatID, userSet);
        simpMessagingTemplate.convertAndSend("/topic/numUsers/" + ownerToken + uniqueChatID, numUsers);
    }

    @MessageMapping("/getNumUsers")
    public void getNumUsers(@Payload ChatID chatID) throws Exception {
        String ownerToken=chatID.getOwnerToken();
        String uniqueChatID=chatID.getUniqueChatID();
        int numUsers=chatService.getNumUsers(chatID);
        simpMessagingTemplate.convertAndSend("/topic/numUsers/" + ownerToken + uniqueChatID, numUsers);
    }

    @MessageMapping("/typing")
    public void handleTyping(@Payload ConnectedUser connectedUser) throws Exception {
        ChatID chatID=connectedUser.getChatID();
        User user=connectedUser.getUser();

        String ownerToken=chatID.getOwnerToken();
        String uniqueChatID=chatID.getUniqueChatID();

        simpMessagingTemplate.convertAndSend("/topic/typing/" + ownerToken + uniqueChatID, user);
    }

    @EventListener(SessionDisconnectEvent.class)
    public void handleDisconnect(SessionDisconnectEvent event){
        SimpMessageHeaderAccessor header=SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sesssionID=header.getSessionId();

        ConnectedUser connectedUser=chatService.getConnectedUser(sesssionID);
        if(connectedUser==null)return;

        Set<User> userSet=chatService.decrementUsers(sesssionID);
        
        ChatID chatID=connectedUser.getChatID();
        String ownerToken=chatID.getOwnerToken();
        String uniqueChatID=chatID.getUniqueChatID();

        simpMessagingTemplate.convertAndSend("/topic/connected/" + ownerToken + uniqueChatID, userSet);
        
    }

}

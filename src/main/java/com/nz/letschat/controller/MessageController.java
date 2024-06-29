package com.nz.letschat.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.nz.letschat.model.Message;
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
    public void send(@Payload ConnectedUser connectedUser, SimpMessageHeaderAccessor headerAccessor) throws Exception {
        ChatID chatID=connectedUser.getChatID();
        String ownerToken=chatID.getOwnerToken();
        String uniqueChatID=chatID.getUniqueChatID();
        String sessionID=headerAccessor.getSessionId();

        chatService.addUser(connectedUser,sessionID);
        int numUsers=chatService.getNumUsers(chatID);

        simpMessagingTemplate.convertAndSend("/topic/connected/userList" + ownerToken + uniqueChatID, numUsers);

    
        System.out.println((sessionID));
    }

    @EventListener(SessionDisconnectEvent.class)
    public void handleDisconnect(SessionDisconnectEvent event){
        SimpMessageHeaderAccessor header=SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sesssionID=header.getSessionId();
        System.out.println("User has Disconnected"+sesssionID);
    }

}

package com.nz.letschat.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.nz.letschat.model.Message;
import com.nz.letschat.service.ChatService;

@Controller

public class MessageController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    ChatService chatService;

    @MessageMapping("/chat")
    public void send(Message message) throws Exception {
        String ownerToken=message.getOwnerToken();
        String uniqueChatID=message.getUniqueChatID();
        String time = new SimpleDateFormat("HH:mm").format(new Date());
        message.setTime(time);
        simpMessagingTemplate.convertAndSend("/topic/messages/" + ownerToken+uniqueChatID, message);
        chatService.getChatAndUpdateMessages(message);
    }

}

package com.nz.letschat.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.nz.letschat.model.Message;

@Controller

public class MessageController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat")
    public void send(Message message) throws Exception {
        String time = new SimpleDateFormat("HH:mm").format(new Date());
        message.setTime(time);
        simpMessagingTemplate.convertAndSend("/topic/messages/" + message.getOwnerToken()+message.getUniqueChatID(), message);
    }

}

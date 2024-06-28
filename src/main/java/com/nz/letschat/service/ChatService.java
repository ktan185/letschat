package com.nz.letschat.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nz.letschat.model.Chat;
import com.nz.letschat.model.Chat.ChatID;
import com.nz.letschat.model.Message;
import com.nz.letschat.repository.ChatRepository;

@Service
public class ChatService {
    @Autowired
    ChatRepository chatRepository;

    public void getChatAndUpdateMessages(Message message) {
        String ownerToken = message.getOwnerToken();
        String uniqueChatID = message.getUniqueChatID();
        ChatID chatId = new ChatID(ownerToken, uniqueChatID);
        Chat chat = chatRepository.findOneByChatID(chatId);
        List<Message> list = chat.getChatMessages();
        list.add(message);
        chatRepository.save(chat);
    }
}

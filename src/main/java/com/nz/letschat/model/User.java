package com.nz.letschat.model;

import java.util.Date;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("User")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User implements Cloneable {
    @Id
    private String email;

    private String firstName;

    private String lastName;

    private String userName;

    private String password;

    private String token = UUID.randomUUID().toString();

    @CreatedDate
    private Date createdDate;

    @Override
    public User clone() {
        try {
            return (User) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException("Clone not supported", e);
        }
    }
}

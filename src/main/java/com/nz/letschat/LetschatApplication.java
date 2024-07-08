package com.nz.letschat;

import io.github.cdimascio.dotenv.Dotenv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class LetschatApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();
		System.setProperty("spring.data.mongodb.uri", dotenv.get("SPRING_DATA_MONGODB_URI"));
		SpringApplication.run(LetschatApplication.class, args);
	}

}

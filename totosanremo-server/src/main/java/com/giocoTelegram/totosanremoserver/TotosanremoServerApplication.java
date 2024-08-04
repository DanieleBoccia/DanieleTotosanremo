package com.giocoTelegram.totosanremoserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling
public class TotosanremoServerApplication {

	public static void main(String[] args) {

		TimeZone.setDefault(TimeZone.getTimeZone("Europe/Rome"));
		SpringApplication.run(TotosanremoServerApplication.class, args);
	}


}

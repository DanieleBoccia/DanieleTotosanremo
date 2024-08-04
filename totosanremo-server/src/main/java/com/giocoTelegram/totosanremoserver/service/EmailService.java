package com.giocoTelegram.totosanremoserver.service;

import com.giocoTelegram.totosanremoserver.repository.EmailApprovataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private EmailApprovataRepository emailApprovataRepository;

    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("danieleboccia43@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    public boolean isEmailApproved(String email) {
        return emailApprovataRepository.existsByEmail(email);
    }
}


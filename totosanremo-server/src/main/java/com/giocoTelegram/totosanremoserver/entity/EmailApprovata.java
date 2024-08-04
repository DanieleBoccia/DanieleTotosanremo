package com.giocoTelegram.totosanremoserver.entity;

import com.giocoTelegram.totosanremoserver.dto.EmailRequestStatus;

import javax.persistence.*;


@Entity
public class EmailApprovata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    @Column(name = "is_registered", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean isRegistered = false; // Default a false

    @Enumerated(EnumType.STRING)
    private EmailRequestStatus status;

    // Getter e setter


    public EmailRequestStatus getStatus() {
        return status;
    }

    public void setStatus(EmailRequestStatus status) {
        this.status = status;
    }

    public boolean isRegistered() {
        return isRegistered;
    }

    public void setRegistered(boolean isRegistered) {
        this.isRegistered = isRegistered;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

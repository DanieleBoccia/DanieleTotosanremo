package com.giocoTelegram.totosanremoserver.dto;

public class PasswordResetRequest {

    private String token;
    private String newPassword;

    // Costruttore di default necessario per la deserializzazione JSON
    public PasswordResetRequest() {
    }

    // Costruttore con tutti i campi, se necessario
    public PasswordResetRequest(String newPassword) {
        this.newPassword = newPassword;
    }

    // Getter e setter
    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}


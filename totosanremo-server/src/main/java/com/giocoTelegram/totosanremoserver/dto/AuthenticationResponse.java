package com.giocoTelegram.totosanremoserver.dto;

// DTO per le risposte di autenticazione (token JWT)
public class AuthenticationResponse {
    private final String jwt;
    private final String message;

    public AuthenticationResponse(String jwt, String message) {
        this.jwt = jwt;
        this.message = message;
    }

    // getter per jwt e message
    public String getJwt() {
        return jwt;
    }

    public String getMessage() {
        return message;
    }
}


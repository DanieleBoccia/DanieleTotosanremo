package com.giocoTelegram.totosanremoserver.dto;

public class EmailApprovalStatus {
    private boolean found;
    private EmailRequestStatus status;

    public EmailApprovalStatus(boolean found, EmailRequestStatus status) {
        this.found = found;
        this.status = status;
    }

    // Getter e setter
    public boolean isFound() {
        return found;
    }

    public void setFound(boolean found) {
        this.found = found;
    }

    public EmailRequestStatus getStatus() {
        return status;
    }

    public void setStatus(EmailRequestStatus status) {
        this.status = status;
    }
}


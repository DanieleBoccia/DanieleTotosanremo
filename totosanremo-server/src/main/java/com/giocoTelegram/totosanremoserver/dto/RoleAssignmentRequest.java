package com.giocoTelegram.totosanremoserver.dto;


import java.util.List;

public class RoleAssignmentRequest {

    private String email;
    private String roleName;

    private List<Long> userIds; // Lista degli ID utente


    // Costruttori
    public RoleAssignmentRequest() {
    }

    public RoleAssignmentRequest(List<Long> userIds, String email, String roleName) {
        this.userIds = userIds;
        this.email = email;
        this.roleName = roleName;
    }

    // Getter e Setter
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Long> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Long> userIds) {
        this.userIds = userIds;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}


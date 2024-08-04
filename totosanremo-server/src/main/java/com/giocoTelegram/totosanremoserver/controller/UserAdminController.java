package com.giocoTelegram.totosanremoserver.controller;

import com.giocoTelegram.totosanremoserver.dto.EmailRequest;
import com.giocoTelegram.totosanremoserver.dto.RoleAssignmentRequest;
import com.giocoTelegram.totosanremoserver.entity.EmailApprovata;
import com.giocoTelegram.totosanremoserver.entity.User;
import com.giocoTelegram.totosanremoserver.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping ("/api/admin")
public class UserAdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/assign-role")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> assignRole(@RequestBody RoleAssignmentRequest request) {
        boolean success = userService.assignRoleToUser(request.getEmail(), request.getRoleName());
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().body("Failed to assign role");
        }
    }


    @PostMapping("/add-approved-email")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> addApprovedEmail(@RequestBody EmailApprovata email) {
        EmailApprovata savedEmail = userService.addApprovedEmail(email.getEmail());
        if (savedEmail != null) {
            return ResponseEntity.ok(savedEmail); // Restituisce l'email salvata come JSON
        } else {
            return ResponseEntity.badRequest().body("Email already exists or invalid request");
        }
    }
    // EmailApprovataController.java

    @DeleteMapping("/delete-approved-email/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteApprovedEmail(@PathVariable Long id) {
        boolean success = userService.deleteApprovedEmail(id);
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().body("Email not found or invalid request");
        }
    }

    /*
    @PutMapping("/update-approved-email/{id}") // Nota l'uso di PutMapping e l'ID nell'URL
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateApprovedEmail(@PathVariable Long id, @RequestBody String email) {
        boolean success = userService.updateApprovedEmail(id, email);
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().body("Email not found or invalid request");
        }
    }
   */

    @PutMapping("/update-approved-email/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateApprovedEmail(@PathVariable Long id, @RequestBody EmailRequest request) {
        boolean success = userService.updateApprovedEmail(id, request.getEmail());
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().body("Email not found or invalid request");
        }
    }


    @GetMapping("/approved-emails")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<EmailApprovata>> getApprovedEmails() {
        List<EmailApprovata> emails = userService.getAllApprovedEmails(); // Assumi userService o il servizio corretto
        return ResponseEntity.ok(emails);
    }

    @PostMapping("/request-approval")
    public ResponseEntity<?> requestEmailApproval(@RequestBody EmailRequest emailRequest) {
        try {
            EmailApprovata newRequest = userService.requestEmailApproval(emailRequest.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(newRequest);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @PostMapping("/approve-email/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> approveEmail(@PathVariable Long id) {
        boolean success = userService.approveEmailRequest(id);
        if (success) {
            return ResponseEntity.ok().body("Email approvata con successo.");
        } else {
            return ResponseEntity.badRequest().body("Impossibile trovare la richiesta di email da approvare.");
        }
    }

    @PostMapping("/reject-email/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> rejectEmail(@PathVariable Long id) {
        boolean success = userService.rejectEmailRequest(id);
        if (success) {
            return ResponseEntity.ok().body("Email rifiutata con successo.");
        } else {
            return ResponseEntity.badRequest().body("Impossibile trovare la richiesta di email da rifiutare.");
        }
    }

    //GESTIONE MULTIPLE UTENTITABLE.JS
    @PostMapping("/assign-roles")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> assignRoles(@RequestBody RoleAssignmentRequest request) {
        try {
            userService.assignRolesToUsers(request.getUserIds(), request.getRoleName());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore nell'assegnazione dei ruoli");
        }
    }

    @PostMapping("/delete-approved-emails")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteApprovedEmails(@RequestBody List<Long> emailIds) {
        try {
            userService.deleteApprovedEmails(emailIds);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore nell'eliminazione delle email");
        }
    }

    @PostMapping("/approve-email-requests")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> approveEmailRequests(@RequestBody List<Long> emailRequestIds) {
        try {
            List<EmailApprovata> approvedEmails = userService.approveEmailRequests(emailRequestIds);
            return ResponseEntity.ok(approvedEmails); // Restituisci l'elenco delle email approvate
        } catch (Exception e) {
            e.printStackTrace(); // Assicurati di loggare l'errore per il debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore nell'approvazione delle richieste email.");
        }
    }


    @PostMapping("/reject-email-requests")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> rejectEmailRequests(@RequestBody List<Long> emailRequestIds) {
        try {
            userService.rejectEmailRequests(emailRequestIds);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore nel rifiuto delle richieste email.");
        }
    }

    //FINE GESTIONE MULTIPLE UTENTITABLE.JS




    @GetMapping("/email-requests")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<EmailApprovata>> getEmailRequests() {
        List<EmailApprovata> emailRequests = userService.getEmailRequests(); // Questo dovrebbe restituire solo le email PENDING
        return ResponseEntity.ok(emailRequests);
    }

}

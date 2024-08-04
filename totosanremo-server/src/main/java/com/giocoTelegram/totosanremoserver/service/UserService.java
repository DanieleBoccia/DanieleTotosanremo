package com.giocoTelegram.totosanremoserver.service;

import com.giocoTelegram.totosanremoserver.dto.EmailApprovalStatus;
import com.giocoTelegram.totosanremoserver.dto.EmailRequestStatus;
import com.giocoTelegram.totosanremoserver.entity.ConfirmationToken;
import com.giocoTelegram.totosanremoserver.entity.EmailApprovata;
import com.giocoTelegram.totosanremoserver.entity.Role;
import com.giocoTelegram.totosanremoserver.entity.User;
import com.giocoTelegram.totosanremoserver.repository.ConfirmationTokenRepository;
import com.giocoTelegram.totosanremoserver.repository.EmailApprovataRepository;
import com.giocoTelegram.totosanremoserver.repository.RoleRepository;
import com.giocoTelegram.totosanremoserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EmailApprovataRepository emailApprovataRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;


    @Autowired
    private EmailService emailService;

    public boolean registerUser(String email, String password) {
        // Controlla se l'email è approvata
        if (!emailApprovata(email)) {
            return false;
        }

        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent() && existingUser.get().isEmailVerified()) {
            return false;
        }

        User userToSave;
        if (existingUser.isPresent()) {
            userToSave = existingUser.get();
            userToSave.setPassword(passwordEncoder.encode(password));
        } else {
            userToSave = new User();
            userToSave.setEmail(email);
            userToSave.setPassword(passwordEncoder.encode(password));
            userToSave.setEmailVerified(false);

            // Genera un username unico
            String uniqueUsername = "User" + UUID.randomUUID().toString().substring(0, 8); // Estrae una parte dell'UUID per brevità
            userToSave.setUsername(uniqueUsername); // Assicurati di avere un campo username nel tuo oggetto User

            // Aggiungi qui il ruolo di base all'utente
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Errore: Ruolo non trovato."));
            userToSave.setRoles(Collections.singleton(userRole));
        }

        userRepository.save(userToSave);

        emailApprovataRepository.findByEmail(email).ifPresent(emailApprovata -> {
            emailApprovata.setRegistered(true);
            emailApprovataRepository.save(emailApprovata);
        });

        String token = UUID.randomUUID().toString();
        ConfirmationToken confirmationToken = new ConfirmationToken();
        confirmationToken.setToken(token);
        confirmationToken.setUser(userToSave);
        confirmationToken.setCreatedAt(LocalDateTime.now());
        confirmationToken.setExpiresAt(LocalDateTime.now().plusDays(1));
        confirmationTokenRepository.save(confirmationToken);

        // Aggiorna il contenuto dell'email per includere l'username
        String confirmationLink = "https://localhost:8443/api/auth/confirm?token=" + token;
        String emailContent = String.format("Per completare la registrazione, clicca sul seguente link: %s \nIl tuo username è: %s", confirmationLink, userToSave.getUsername());
        emailService.sendSimpleMessage(email, "Conferma la tua registrazione", emailContent);

        return true;
    }

    public boolean isEmailRegistered(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public boolean assignRoleToUser(String email, String roleName) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().isEmailVerified()) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato con email: " + email));
        Role newRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Errore: Ruolo non trovato."));

        // Rimuovi tutti i ruoli correnti e aggiungi il nuovo ruolo
        user.getRoles().clear();
        user.getRoles().add(newRole);

        userRepository.save(user);
        return true;
    }
        return false; // Return false if user not found or email not verified
    }

    //INIZIO GESTIONE MULTIPLE UTENTITABLE.JS
    public void assignRolesToUsers(List<Long> userIds, String roleName) {
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Errore: Ruolo non trovato."));
        for (Long userId : userIds) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Errore: Utente non trovato."));
            user.getRoles().clear(); // Rimuovi i ruoli esistenti se necessario
            user.getRoles().add(role);
            userRepository.save(user);
        }
    }

    public void deleteApprovedEmails(List<Long> emailIds) {
        for (Long emailId : emailIds) {
            emailApprovataRepository.deleteById(emailId);
        }
    }


    /*
    public void approveEmailRequests(List<Long> emailRequestIds) {
        emailRequestIds.forEach(this::approveEmailRequest);
    }
    */

    public List<EmailApprovata> approveEmailRequests(List<Long> emailRequestIds) {
        List<EmailApprovata> approvedEmails = new ArrayList<>();
        for (Long id : emailRequestIds) {
            Optional<EmailApprovata> emailApprovataOpt = emailApprovataRepository.findById(id);
            if (emailApprovataOpt.isPresent()) {
                EmailApprovata emailApprovata = emailApprovataOpt.get();
                emailApprovata.setStatus(EmailRequestStatus.APPROVED);
                approvedEmails.add(emailApprovataRepository.save(emailApprovata));
            }
        }
        return approvedEmails;
    }


    public void rejectEmailRequests(List<Long> emailRequestIds) {
        emailRequestIds.forEach(this::rejectEmailRequest);
    }

    //FINE GESTIONE MULTIPLE UTENTITABLE.JS



    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }



    private boolean emailApprovata(String email) {
        Optional<EmailApprovata> emailOpt = emailApprovataRepository.findByEmail(email);
        return emailOpt.isPresent() && emailOpt.get().getStatus() != EmailRequestStatus.PENDING;
    }


    public boolean verifyToken(String token) {
        Optional<ConfirmationToken> confirmationTokenOptional = confirmationTokenRepository.findByToken(token);

        return confirmationTokenOptional.map(confirmationToken -> {
            if (!confirmationToken.isExpired()) {
                User user = confirmationToken.getUser();
                user.setEmailVerified(true);
                userRepository.save(user);
                confirmationTokenRepository.delete(confirmationToken);
                return true;
            } else {
                return false;
            }
        }).orElse(false);
    }


    public boolean generateResetPasswordToken(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            return false;
        }
        User user = userOptional.get();
        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiryDate(LocalDateTime.now().plusHours(2)); // Imposta la scadenza a 2 ore
        userRepository.save(user);

        String resetPasswordLink = "https://localhost:3000/reset-password?token=" + token;
        emailService.sendSimpleMessage(email, "Reimposta la tua password", "Clicca sul link seguente per reimpostare la tua password: " + resetPasswordLink);

        return true;
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<User> userOptional = userRepository.findByResetPasswordToken(token);
        if (!userOptional.isPresent()) {
            return false;
        }
        User user = userOptional.get();
        // Verifica anche la scadenza del token
        if (user.getResetPasswordTokenExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null); // Cancella il token dopo l'uso
        user.setResetPasswordTokenExpiryDate(null); // Cancella anche la scadenza
        userRepository.save(user);
        return true;
    }

    public boolean validateResetPasswordToken(String token) {
        // Cerca l'utente con il token di reset password fornito
        Optional<User> userOptional = userRepository.findByResetPasswordToken(token);
        if (!userOptional.isPresent()) {
            return false; // Nessun utente trovato con questo token
        }

        User user = userOptional.get();
        // Controlla se il token è scaduto
        if (user.getResetPasswordTokenExpiryDate().isBefore(LocalDateTime.now())) {
            return false; // Token scaduto
        }

        return true; // Token valido
    }

    /*
    public EmailApprovata addApprovedEmail(String email) {
        if (!emailApprovataRepository.existsByEmail(email)) {
            EmailApprovata newEmail = new EmailApprovata();
            newEmail.setEmail(email);
            return emailApprovataRepository.save(newEmail); // Salva e restituisce l'oggetto salvato
        }
        return null; // Restituisce null se l'email esiste già
    }

     */

    public EmailApprovata addApprovedEmail(String email) {
        if (!emailApprovataRepository.existsByEmail(email)) {
            EmailApprovata newEmail = new EmailApprovata();
            newEmail.setEmail(email);
            newEmail.setStatus(EmailRequestStatus.APPROVED); // Imposta lo status su APPROVED
            return emailApprovataRepository.save(newEmail); // Salva e restituisce l'oggetto salvato
        }
        return null; // Restituisce null se l'email esiste già
    }



    // UserService.java

    public boolean deleteApprovedEmail(Long id) {
        if (emailApprovataRepository.existsById(id)) {
            emailApprovataRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean updateApprovedEmail(Long id, String newEmail) {
        Optional<EmailApprovata> emailApprovataOptional = emailApprovataRepository.findById(id);
        if (emailApprovataOptional.isPresent()) {
            EmailApprovata emailApprovata = emailApprovataOptional.get();
            emailApprovata.setEmail(newEmail);
            emailApprovataRepository.save(emailApprovata);
            return true;
        }
        return false;
    }

    // UserService.java o un servizio dedicato


    /*
    public List<EmailApprovata> getAllApprovedEmails() {
        return emailApprovataRepository.findAll();
    }

     */


    public List<EmailApprovata> getAllApprovedEmails() {
        List<EmailApprovata> approvedEmails = emailApprovataRepository.findAll();
        List<String> registeredEmails = userRepository.findAll().stream()
                .map(User::getEmail)
                .collect(Collectors.toList());

        approvedEmails.forEach(email -> {
            email.setRegistered(registeredEmails.contains(email.getEmail()));
            // Puoi aggiungere qui qualsiasi altra logica necessaria
        });
        return approvedEmails;
    }

    public EmailApprovata requestEmailApproval(String email) {
        if (emailApprovataRepository.existsByEmail(email)) {
            throw new IllegalStateException("Esiste già una richiesta per questa email o è stata già approvata.");
        }

        EmailApprovata emailApprovata = new EmailApprovata();
        emailApprovata.setEmail(email);
        emailApprovata.setStatus(EmailRequestStatus.PENDING);
        return emailApprovataRepository.save(emailApprovata);
    }

    public List<EmailApprovata> getEmailRequests() {
        // Assumendo che tu abbia definito un metodo findEmailRequestsByStatus nel tuo repository
        return emailApprovataRepository.findEmailRequestsByStatus(EmailRequestStatus.PENDING);
    }



    public boolean approveEmailRequest(Long id) {
        Optional<EmailApprovata> emailApprovataOpt = emailApprovataRepository.findById(id);
        if (emailApprovataOpt.isPresent()) {
            EmailApprovata emailApprovata = emailApprovataOpt.get();
            emailApprovata.setStatus(EmailRequestStatus.APPROVED);
            emailApprovataRepository.save(emailApprovata);
            return true;
        }
        return false;
    }



    public boolean rejectEmailRequest(Long id) {
        Optional<EmailApprovata> emailApprovataOpt = emailApprovataRepository.findById(id);
        if (emailApprovataOpt.isPresent()) {
            // EmailApprovata emailApprovata = emailApprovataOpt.get();
            // emailApprovata.setStatus(EmailRequestStatus.REJECTED);
            // emailApprovataRepository.save(emailApprovata);
            emailApprovataRepository.deleteById(id); // Cancellazione della richiesta
            return true;
        }
        return false;
    }



    public EmailApprovalStatus isEmailApproved(String email) {
        Optional<EmailApprovata> emailOpt = emailApprovataRepository.findByEmail(email);
        if (emailOpt.isPresent()) {
            // Trovata l'email, ritorna lo stato specifico
            return new EmailApprovalStatus(true, emailOpt.get().getStatus());
        } else {
            // Email non trovata, puoi decidere di ritornare NOT_FOUND o un altro stato appropriato
            return new EmailApprovalStatus(false, EmailRequestStatus.NOT_FOUND);
        }
    }


}



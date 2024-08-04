package com.giocoTelegram.totosanremoserver.controller;

import com.giocoTelegram.totosanremoserver.config.ErrorResponse;
import com.giocoTelegram.totosanremoserver.config.JwtTokenService;
import com.giocoTelegram.totosanremoserver.config.JwtTokenUtil;
import com.giocoTelegram.totosanremoserver.dto.*;
import com.giocoTelegram.totosanremoserver.entity.ConfirmationToken;
import com.giocoTelegram.totosanremoserver.entity.Role;
import com.giocoTelegram.totosanremoserver.entity.User;
import com.giocoTelegram.totosanremoserver.repository.ConfirmationTokenRepository;
import com.giocoTelegram.totosanremoserver.service.CustomUserDetailsService;
import com.giocoTelegram.totosanremoserver.service.EmailService;
import com.giocoTelegram.totosanremoserver.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;

    @Autowired
    CustomUserDetailsService customUserDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest request, HttpServletResponse response) {
        try {
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(request.getEmail());

            if (passwordEncoder.matches(request.getPassword(), userDetails.getPassword())) {
                final String token = jwtTokenUtil.generateToken(userDetails);

                Cookie jwtCookie = new Cookie("jwt", token);
                jwtCookie.setHttpOnly(true);
                jwtCookie.setPath("/");
                jwtCookie.setSecure(true); // Imposta il cookie come Secure
                response.addCookie(jwtCookie);

                String sameSiteAttribute = "SameSite=Lax";
                response.addHeader("Set-Cookie", "jwt=" + token + "; HttpOnly; Path=/; Secure; " + sameSiteAttribute);

                return ResponseEntity.ok(new AuthenticationResponse(token, "User logged in successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid credentials");
            }
        } catch (UsernameNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: " + ex.getMessage());
        }
    }



    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AuthenticationRequest request) {
        try {
            boolean isRegistered = userService.registerUser(request.getEmail(), request.getPassword());
            if (isRegistered) {
                return ResponseEntity.ok("User registered successfully. Please check your email to confirm.");
            } else {
                // Questo ramo potrebbe essere raggiunto se l'utente esiste ed è già stato verificato.
                return ResponseEntity.badRequest().body(new ErrorResponse("User already registered and verified."));
            }
        } catch (Exception e) {
            // Cattura eccezioni specifiche se necessario, ad esempio EmailSendException per problemi di invio email
            return ResponseEntity.badRequest().body(new ErrorResponse("Registration failed. " + e.getMessage()));
        }
    }



    @GetMapping("/confirm")
    public ResponseEntity<?> confirmRegistration(@RequestParam("token") String token) {
        boolean isTokenValid = userService.verifyToken(token);
        if (isTokenValid) {
            // Aggiorna lo stato dell'utente a "verificato"
            return ResponseEntity.ok("Account verified successfully.");
        } else {
            // Gestisci il caso in cui il token non è valido o è scaduto
            return ResponseEntity.badRequest().body("Invalid or expired token.");
        }
    }

    @GetMapping("/verifyToken")
    public ResponseEntity<?> verifyToken(HttpServletRequest request) {
        // Estrai il token JWT dal cookie
        String token = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("jwt")) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        if (token != null && jwtTokenService.verifyToken(token)) {
            return ResponseEntity.ok().body("{\"message\": \"Token is valid\"}");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Invalid or expired token\"}");
        }
    }


    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestBody PasswordResetRequest request) {
        boolean resetSuccessful = userService.resetPassword(token, request.getNewPassword());
        if (resetSuccessful) {
            return ResponseEntity.ok("{\"message\": \"Password reset successfully\"}");
        } else {
            return ResponseEntity.badRequest().body(new ErrorResponse("{\"error\": \"Invalid or expired token\"}"));
        }
    }

    @GetMapping("/validate-reset-password-token")
    public ResponseEntity<?> validateResetPasswordToken(@RequestParam String token) {
        boolean isValid = userService.validateResetPasswordToken(token);
        if (isValid) {
            return ResponseEntity.ok().body("Token is valid.");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired token.");
        }
    }


    @PostMapping("/request-reset-password")
    public ResponseEntity<?> requestResetPassword(@RequestBody EmailRequest request) {
        boolean isRequestSuccessful = userService.generateResetPasswordToken(request.getEmail());
        if (isRequestSuccessful) {
            return ResponseEntity.ok("{\"message\": \"Check your email for reset password instructions.\"}");
        } else {
            return ResponseEntity.badRequest().body("{\"error\": \"Email not found.\"}");
        }
    }

    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmailApproval(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        EmailApprovalStatus approvalStatus = userService.isEmailApproved(email);

        Map<String, Object> response = new HashMap<>();
        response.put("found", approvalStatus.isFound());
        response.put("status", approvalStatus.getStatus().toString());

        return ResponseEntity.ok(response);
    }



    @PostMapping("/check-email-registered")
    public ResponseEntity<?> checkEmailRegistered(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        boolean isRegistered = userService.isEmailRegistered(email);

        return ResponseEntity.ok(Collections.singletonMap("registered", isRegistered));
    }

    @GetMapping("/user/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            // Usa orElseThrow per sollevare un'eccezione se l'utente non viene trovato
            User user = userService.findByEmail(userPrincipal.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userPrincipal.getEmail()));

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("name", user.getUsername());
            userInfo.put("email", user.getEmail());
            userInfo.put("roles", user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
            return ResponseEntity.ok(userInfo);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }


}


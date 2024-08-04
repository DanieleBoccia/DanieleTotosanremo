package com.giocoTelegram.totosanremoserver.config;

import com.giocoTelegram.totosanremoserver.service.CustomUserDetailsService;
import com.giocoTelegram.totosanremoserver.service.UserService;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;

@Service
public class JwtTokenService {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private CustomUserDetailsService customUserDetailsService; // Modificato da UserService a CustomUserDetailsService

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtSecretKey jwtSecretKey;


    public String generateTokenForUser(String email, String password) {
        authenticate(email, password);
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
        return jwtTokenUtil.generateToken(userDetails);
    }

    private void authenticate(String email, String password) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid credentials", e);
        }
    }

    public boolean verifyToken(String token) {
        try {
            SecretKey secretKey = jwtSecretKey.getSecretKey();
            // Converti la SecretKey in una chiave utilizzabile da JJWT
            // Assumendo che stai utilizzando l'algoritmo HS512 per la firma
            byte[] keyBytes = secretKey.getEncoded();
            Key hmacKey = new SecretKeySpec(keyBytes, SignatureAlgorithm.HS512.getJcaName());

            Jwts.parser().setSigningKey(hmacKey).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Log l'eccezione o gestisci l'errore come preferisci
            return false;
        }
    }

}


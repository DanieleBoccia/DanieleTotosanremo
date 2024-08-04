package com.giocoTelegram.totosanremoserver.dto;

import com.giocoTelegram.totosanremoserver.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;

public class UserPrincipal implements UserDetails {
    private User user;

    // Costruttore
    public UserPrincipal(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Qui dovresti ritornare le autorità (ruoli) dell'utente.
        // Questo può variare a seconda di come hai strutturato il tuo sistema di ruoli.
        return null; // Sostituisci con la tua implementazione.
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail(); // O `user.getUsername()`, a seconda del tuo caso d'uso.
    }

    // Metodo aggiuntivo per ottenere l'email.
    public String getEmail() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        // Qui dovresti implementare la logica per determinare se l'account è scaduto.
        return true; // Per semplicità, ritorna true per indicare che l'account non è scaduto.
    }

    @Override
    public boolean isAccountNonLocked() {
        // Implementa la logica per verificare se l'account è bloccato.
        return true; // Assumiamo che l'account non sia bloccato.
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // Qui controlli se le credenziali (password) sono scadute.
        return true; // Per semplicità, ritorna true.
    }

    @Override
    public boolean isEnabled() {
        // Implementa qui il controllo per vedere se l'utente è abilitato.
        return true; // Per semplicità, assumiamo che l'utente sia abilitato.
    }
}



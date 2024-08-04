package com.giocoTelegram.totosanremoserver.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.KeyStore;

@Component
public class JwtSecretKey {

    @Value("${jwt.keystore.location}")
    private Resource keystoreLocation;

    @Value("${jwt.keystore.password}")
    private String keystorePassword;

    @Value("${jwt.key.alias}")
    private String keyAlias;

    public SecretKey getSecretKey() {
        try {
            // Carica il keystore
            KeyStore keyStore = KeyStore.getInstance("PKCS12");
            keyStore.load(keystoreLocation.getInputStream(), keystorePassword.toCharArray());

            // Estrai la chiave segreta
            KeyStore.ProtectionParameter protParam = new KeyStore.PasswordProtection(keystorePassword.toCharArray());
            KeyStore.SecretKeyEntry skEntry = (KeyStore.SecretKeyEntry) keyStore.getEntry(keyAlias, protParam);
            return skEntry.getSecretKey();
        } catch (Exception e) {
            throw new RuntimeException("Impossibile caricare la chiave segreta dal keystore", e);
        }
    }
}

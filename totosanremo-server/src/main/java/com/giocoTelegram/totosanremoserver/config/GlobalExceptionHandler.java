package com.giocoTelegram.totosanremoserver.config;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Gestione specifica di NullPointerException
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<?> handleNullPointerException(NullPointerException ex, WebRequest request) {
        // Log dell'eccezione, se necessario
        ErrorDetails errorDetails = new ErrorDetails("Server error", request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails("Validation Error", "Uno o più campi hanno fallito la validazione.");
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    // Gestione specifica di NumberFormatException
    @ExceptionHandler(NumberFormatException.class)
    public ResponseEntity<?> handleNumberFormatException(NumberFormatException ex, WebRequest request) {
        // Log dell'eccezione, se necessario
        ErrorDetails errorDetails = new ErrorDetails("Format error", "Il formato del numero fornito non è valido.");
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }


    // Gestione generica di Exception (tutte le altre eccezioni non specificamente gestite)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex, WebRequest request) {
        // Log dell'eccezione, se necessario
        ErrorDetails errorDetails = new ErrorDetails("Server error", request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Classe per i dettagli dell'errore
    public static class ErrorDetails {
        private String message;
        private String details;

        public ErrorDetails(String message, String details) {
            this.message = message;
            this.details = details;
        }

        // Getter e setter
        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getDetails() {
            return details;
        }

        public void setDetails(String details) {
            this.details = details;
        }
    }
}


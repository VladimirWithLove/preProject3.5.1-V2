package ru.kata.spring.boot_security.demo.ecxeption_handling;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class EmployeeGlobalExceptionHandler {
    @ExceptionHandler
    public ResponseEntity<UserIncorrectData> handleException(Exception e) {
        UserIncorrectData userIncorrectData = new UserIncorrectData();
        userIncorrectData.setInfo(e.getMessage());

        HttpStatus httpStatus;
        if (e.getClass() == NoSuchUserException.class) {
            httpStatus = HttpStatus.NOT_FOUND;
        } else {
            httpStatus = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<>(userIncorrectData, httpStatus);
    }
}

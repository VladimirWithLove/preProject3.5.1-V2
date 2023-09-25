package ru.kata.spring.boot_security.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.ecxeption_handling.NoSuchUserException;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;


@RestController
@RequestMapping("/api/admin")
public class AdminRestController {

    private final UserService userService;

    @Autowired
    public AdminRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> showAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public User getUser(@PathVariable("id") long id) {

        User user = userService.getUser(id);
        if (user == null) {
            throw new NoSuchUserException("There is no user with id = " + id
                    + " in database");
        }
        return user;
    }

    @PostMapping("/users")
    public User addNewUser(@RequestBody @Valid User user,
                           BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            StringBuilder errorMessage = new StringBuilder();
            List<FieldError> errors =  bindingResult.getFieldErrors();
            for (FieldError error : errors) {
                errorMessage.append(error.getField())
                        .append(" - ").append(error.getDefaultMessage())
                        .append("; ");
            }
            throw new RuntimeException(errorMessage.toString().trim());
        }

        if (user.getId() == null || userService.getUser(user.getId()) == null) {
            userService.add(user);
            return user;
        } else {
            throw new RuntimeException("id must be null");
        }
    }

    @PutMapping("/users")
    public User updateUser(@RequestBody User user) {
        if (user.getId() == null) {
            throw new RuntimeException("id mustn't be null");
        }
        try {
            userService.updateUser(user.getId(), user);
        } catch (Exception e) {
            throw new NoSuchUserException("There is no user with id = " + user.getId()
                    + " in database");
        }
        return userService.getUser(user.getId());
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable("id") long id) {

        if (userService.getUser(id) == null) {
            throw new NoSuchUserException("There is no user with id = " + id
                    + " in database");
        }

        userService.deleteUser(id);
        return "User with id = " + id + " was deleted";
    }
}

package ru.kata.spring.boot_security.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.configs.SuccessUserHandler;
import ru.kata.spring.boot_security.demo.model.User;


@Controller
@RequestMapping("/admin")
public class AdminsController {
    private final SuccessUserHandler successUserHandler;

    @Autowired
    public AdminsController(SuccessUserHandler successUserHandler) {
        this.successUserHandler = successUserHandler;
    }

    @GetMapping()
    public String showAllUsers(Model model) {
        User user = successUserHandler.getCurrentUser();
        model.addAttribute("thisUser", user);
        return "forAdmin/all-users";
    }
}

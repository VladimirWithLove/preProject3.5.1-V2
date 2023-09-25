package ru.kata.spring.boot_security.demo.service;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.UserDao;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.*;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserDao userDao;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserServiceImpl(BCryptPasswordEncoder bCryptPasswordEncoder, UserDao userDao) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.userDao = userDao;
    }

    @Transactional
    @Override
    public void add(User user) {
        if (user.getProfession() != null && user.getProfession().contains("ROLE_ADMIN")) {
            user.setRoles(new HashSet<>(List.of(new Role(1L, "ROLE_USER"), new Role(2L, "ROLE_ADMIN"))));
        } else {
            user.setRoles(Collections.singleton(new Role(1L, "ROLE_USER")));
        }
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userDao.add(user);
    }
    @Transactional(readOnly = true)
    @Override
    public List<User> getAllUsers() {
        List<User> users = userDao.getAllUsers();
        for (User user : users) {
            rolesInitialize(user);
        }
        return users;
    }

    @Transactional(readOnly = true)
    @Override
    public User getUser(long id) {
        User user = userDao.getUser(id);
        rolesInitialize(user);
        return userDao.getUser(id);
    }

    @Transactional
    @Override
    public void deleteUser(long id) {
        userDao.deleteUser(id);
    }

    @Transactional
    @Override
    public void updateUser(long id, User user) {
        User editedUser = userDao.updateUser(id, user);

        if (!user.getPassword().isEmpty()) {
            editedUser.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        }
        if  (user.getProfession() != null) {
            if (user.getProfession().contains("ROLE_ADMIN")) {
                editedUser.setRoles(new HashSet<>(List.of(new Role(1L, "ROLE_USER"), new Role(2L, "ROLE_ADMIN"))));
                editedUser.setProfession("ROLE_ADMIN");
            } else {
                editedUser.setRoles(Collections.singleton(new Role(1L, "ROLE_USER")));
                editedUser.setProfession("ROLE_USER");
            }
        }
    }

    @Transactional
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDao.findByUserName(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found!");
        }
        rolesInitialize(user);
        return user;
    }

    public void rolesInitialize(User user) {
        Hibernate.initialize(user.getRoles());
    }
}

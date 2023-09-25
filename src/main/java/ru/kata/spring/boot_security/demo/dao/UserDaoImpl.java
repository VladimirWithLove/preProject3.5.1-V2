package ru.kata.spring.boot_security.demo.dao;

import org.hibernate.Hibernate;
import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.User;

import javax.persistence.*;
import java.util.*;

@Repository
public class UserDaoImpl implements UserDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void add(User user) {
        User userFromDB = findByUserName(user.getName());
        if (userFromDB != null) {
            return;
        }
        entityManager.persist(user);
    }

    @Override
    public List<User> getAllUsers() {
        TypedQuery<User> query = entityManager.createQuery("from User", User.class);
        return query.getResultList();
    }

    @Override
    public User getUser(long id) {
        return entityManager.find(User.class, id);
    }

    @Override
    public void deleteUser(long id) {
        Query query = entityManager.createQuery("delete from User where id = :userid");
        query.setParameter("userid", id);
        query.executeUpdate();
    }

    @Override
    public User updateUser(long id, User user) {
        Query query = entityManager.createQuery("update User set login= :newLogin, name= :newName, surname= :newSurname, " +
                "age= :newAge where id= :userId");
        query.setParameter("newLogin", user.getLogin());
        query.setParameter("newName", user.getName());
        query.setParameter("newSurname", user.getSurname());
        query.setParameter("newAge", user.getAge());
        query.setParameter("userId", id);
        query.executeUpdate();

        return getUser(id);
    }

    @Override
    public User findByUserName(String name) {
        TypedQuery<User> query = entityManager.createQuery("from User where login =: username", User.class);
        query.setParameter("username", name);
        User user;
        try {
            user = query.getSingleResult();
        } catch (NoResultException exception) {
            return null;
        }
        return user;
    }
}

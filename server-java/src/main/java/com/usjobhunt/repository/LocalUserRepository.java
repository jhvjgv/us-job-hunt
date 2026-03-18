package com.usjobhunt.repository;

import com.usjobhunt.entity.LocalUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocalUserRepository extends JpaRepository<LocalUser, Integer> {
    Optional<LocalUser> findByEmail(String email);
    boolean existsByEmail(String email);
}

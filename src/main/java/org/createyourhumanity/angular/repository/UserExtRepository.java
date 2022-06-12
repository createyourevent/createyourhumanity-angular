package org.createyourhumanity.angular.repository;

import java.util.List;
import java.util.Optional;
import org.createyourhumanity.angular.domain.User;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the {@link User} entity.
 */
@Repository
public interface UserExtRepository extends MongoRepository<User, String> {
    String USERS_BY_LOGIN_CACHE = "usersByLogin";

    String USERS_BY_EMAIL_CACHE = "usersByEmail";

    List<User> findAllByIdNotNullAndActivatedIsTrue();
    User findByIdAndActivatedIsTrue(String id);
}

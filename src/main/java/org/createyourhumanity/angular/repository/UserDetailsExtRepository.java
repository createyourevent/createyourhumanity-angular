package org.createyourhumanity.angular.repository;

import org.createyourhumanity.angular.domain.UserDetails;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the UserDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserDetailsExtRepository extends MongoRepository<UserDetails, String> {
    UserDetails findOneByUser(String userId);
}

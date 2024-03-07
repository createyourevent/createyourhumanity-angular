package org.createyourhumanity.angular.repository;

import org.createyourhumanity.angular.domain.GrantsLevel;
import org.createyourhumanity.angular.domain.VisibilityStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the VisibilityStatus entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VisibilityStatusExtRepository extends MongoRepository<VisibilityStatus, String> {

    @Query("{'user.$id': ?0}")
    VisibilityStatus findByUser(String userId);
}

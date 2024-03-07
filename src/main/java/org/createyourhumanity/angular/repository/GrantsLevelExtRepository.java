package org.createyourhumanity.angular.repository;

import org.createyourhumanity.angular.domain.FormulaData;
import org.createyourhumanity.angular.domain.GrantsLevel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the GrantsLevel entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GrantsLevelExtRepository extends MongoRepository<GrantsLevel, String> {
        @Query("{'user.$id': ?0}")
        GrantsLevel findByUser(String userId);
}

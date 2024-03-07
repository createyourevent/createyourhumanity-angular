package org.createyourhumanity.angular.repository;

import org.createyourhumanity.angular.domain.VisibilityStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the VisibilityStatus entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VisibilityStatusRepository extends MongoRepository<VisibilityStatus, String> {}

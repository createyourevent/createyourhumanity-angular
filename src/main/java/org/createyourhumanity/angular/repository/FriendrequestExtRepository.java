package org.createyourhumanity.angular.repository;

import java.util.List;
import org.createyourhumanity.angular.domain.Friendrequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Friendrequest entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FriendrequestExtRepository extends MongoRepository<Friendrequest, String> {

    List<Friendrequest> findByRequestUserId(String userId);
}

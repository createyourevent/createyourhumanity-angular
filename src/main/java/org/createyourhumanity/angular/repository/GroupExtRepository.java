package org.createyourhumanity.angular.repository;

import java.util.List;
import java.util.Set;

import org.createyourhumanity.angular.domain.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Group entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GroupExtRepository extends MongoRepository<Group, String> {
    @Query("{'owner.$id': ?0}")
    Set<Group> findGroupsFromOwner(String ownerId);

    @Query("users{: {$all: [{'$elemMatch' :{_id: '?0' }}]}}")
    public Set<Group> findAllByUsers(String id);
}

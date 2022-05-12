package org.createyourhumanity.angular.repository;

import java.util.List;
import org.createyourhumanity.angular.domain.Friends;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Friends entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FriendsExtRepository extends MongoRepository<Friends, String> {
    @Query("{'user.$id': ?0}")
    List<Friends> findByUser(String userId);

    List<Friends> deleteByFriendId(String friendId);
}

package org.createyourhumanity.angular.repository;

import org.createyourhumanity.angular.domain.Mindmap;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Mindmap entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MindmapRepository extends MongoRepository<Mindmap, String> {}

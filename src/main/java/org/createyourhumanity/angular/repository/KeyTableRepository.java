package org.createyourhumanity.angular.repository;

import org.createyourhumanity.angular.domain.KeyTable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the KeyTable entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KeyTableRepository extends MongoRepository<KeyTable, String> {}

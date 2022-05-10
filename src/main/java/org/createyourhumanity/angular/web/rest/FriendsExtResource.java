package org.createyourhumanity.angular.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourhumanity.angular.domain.Friends;
import org.createyourhumanity.angular.repository.FriendsExtRepository;
import org.createyourhumanity.angular.repository.FriendsRepository;
import org.createyourhumanity.angular.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.createyourhumanity.angular.domain.Friends}.
 */
@RestController
@RequestMapping("/api")
public class FriendsExtResource {

    private final Logger log = LoggerFactory.getLogger(FriendsResource.class);

    private static final String ENTITY_NAME = "friends";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FriendsExtRepository friendsExtRepository;

    public FriendsExtResource(FriendsExtRepository friendsExtRepository) {
        this.friendsExtRepository = friendsExtRepository;
    }


    /**
     * {@code GET  /friends/:id} : get the "id" friends by user.
     *
     * @param id the id of the friends to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the friends, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/friends/{id}/findByUser")
    public List<Friends> getFriends(@PathVariable String id) {
        log.debug("REST request to get Friendslist : {}", id);
        List<Friends> friends = friendsExtRepository.findByUser(id);
        return friends;
    }

    /**
     * {@code DELETE  /friends/:id} : delete the "id" friends.
     *
     * @param id the id of the friends to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/friends/{id}")
    public ResponseEntity<Void> deleteFriends(@PathVariable String id) {
        log.debug("REST request to delete Friends : {}", id);
        friendsRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}

package org.createyourhumanity.angular.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourhumanity.angular.domain.Friendrequest;
import org.createyourhumanity.angular.repository.FriendrequestRepository;
import org.createyourhumanity.angular.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.createyourhumanity.angular.domain.Friendrequest}.
 */
@RestController
@RequestMapping("/api")
public class FriendrequestResource {

    private final Logger log = LoggerFactory.getLogger(FriendrequestResource.class);

    private static final String ENTITY_NAME = "friendrequest";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FriendrequestRepository friendrequestRepository;

    public FriendrequestResource(FriendrequestRepository friendrequestRepository) {
        this.friendrequestRepository = friendrequestRepository;
    }

    /**
     * {@code POST  /friendrequests} : Create a new friendrequest.
     *
     * @param friendrequest the friendrequest to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new friendrequest, or with status {@code 400 (Bad Request)} if the friendrequest has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/friendrequests")
    public ResponseEntity<Friendrequest> createFriendrequest(@RequestBody Friendrequest friendrequest) throws URISyntaxException {
        log.debug("REST request to save Friendrequest : {}", friendrequest);
        if (friendrequest.getId() != null) {
            throw new BadRequestAlertException("A new friendrequest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Friendrequest result = friendrequestRepository.save(friendrequest);
        return ResponseEntity
            .created(new URI("/api/friendrequests/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /friendrequests/:id} : Updates an existing friendrequest.
     *
     * @param id the id of the friendrequest to save.
     * @param friendrequest the friendrequest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated friendrequest,
     * or with status {@code 400 (Bad Request)} if the friendrequest is not valid,
     * or with status {@code 500 (Internal Server Error)} if the friendrequest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/friendrequests/{id}")
    public ResponseEntity<Friendrequest> updateFriendrequest(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Friendrequest friendrequest
    ) throws URISyntaxException {
        log.debug("REST request to update Friendrequest : {}, {}", id, friendrequest);
        if (friendrequest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, friendrequest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!friendrequestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Friendrequest result = friendrequestRepository.save(friendrequest);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, friendrequest.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /friendrequests/:id} : Partial updates given fields of an existing friendrequest, field will ignore if it is null
     *
     * @param id the id of the friendrequest to save.
     * @param friendrequest the friendrequest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated friendrequest,
     * or with status {@code 400 (Bad Request)} if the friendrequest is not valid,
     * or with status {@code 404 (Not Found)} if the friendrequest is not found,
     * or with status {@code 500 (Internal Server Error)} if the friendrequest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/friendrequests/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Friendrequest> partialUpdateFriendrequest(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Friendrequest friendrequest
    ) throws URISyntaxException {
        log.debug("REST request to partial update Friendrequest partially : {}, {}", id, friendrequest);
        if (friendrequest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, friendrequest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!friendrequestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Friendrequest> result = friendrequestRepository
            .findById(friendrequest.getId())
            .map(existingFriendrequest -> {
                if (friendrequest.getRequestDate() != null) {
                    existingFriendrequest.setRequestDate(friendrequest.getRequestDate());
                }
                if (friendrequest.getRequestUserId() != null) {
                    existingFriendrequest.setRequestUserId(friendrequest.getRequestUserId());
                }
                if (friendrequest.getInfo() != null) {
                    existingFriendrequest.setInfo(friendrequest.getInfo());
                }

                return existingFriendrequest;
            })
            .map(friendrequestRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, friendrequest.getId())
        );
    }

    /**
     * {@code GET  /friendrequests} : get all the friendrequests.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of friendrequests in body.
     */
    @GetMapping("/friendrequests")
    public List<Friendrequest> getAllFriendrequests() {
        log.debug("REST request to get all Friendrequests");
        return friendrequestRepository.findAll();
    }

    /**
     * {@code GET  /friendrequests/:id} : get the "id" friendrequest.
     *
     * @param id the id of the friendrequest to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the friendrequest, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/friendrequests/{id}")
    public ResponseEntity<Friendrequest> getFriendrequest(@PathVariable String id) {
        log.debug("REST request to get Friendrequest : {}", id);
        Optional<Friendrequest> friendrequest = friendrequestRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(friendrequest);
    }

    /**
     * {@code DELETE  /friendrequests/:id} : delete the "id" friendrequest.
     *
     * @param id the id of the friendrequest to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/friendrequests/{id}")
    public ResponseEntity<Void> deleteFriendrequest(@PathVariable String id) {
        log.debug("REST request to delete Friendrequest : {}", id);
        friendrequestRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}

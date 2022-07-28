package org.createyourhumanity.angular.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.createyourhumanity.angular.domain.Group;
import org.createyourhumanity.angular.repository.GroupExtRepository;
import org.createyourhumanity.angular.repository.GroupRepository;
import org.createyourhumanity.angular.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.createyourhumanity.angular.domain.Group}.
 */
@RestController
@RequestMapping("/api")
public class GroupExtResource {

    private final Logger log = LoggerFactory.getLogger(GroupResource.class);

    private static final String ENTITY_NAME = "group";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GroupExtRepository groupExtRepository;

    public GroupExtResource(GroupExtRepository groupExtRepository) {
        this.groupExtRepository = groupExtRepository;
    }



    /**
     * {@code GET  /groups} : get all the groups.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of groups in body.
     */
    @GetMapping("/groups/{ownerId}/findByOwner")
    public Set<Group> getGroupsFromOwner(@PathVariable String ownerId) {
        log.debug("REST request to get all Groups");
        return groupExtRepository.findGroupsFromOwner(ownerId);
    }

    /**
     * {@code GET  /groups/:id} : get the "id" group.
     *
     * @param id the id of the group to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the group, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/groups/{userId}/findAllByUser")
    public Set<Group> getGroupsFromUser(@PathVariable String userId) {
        log.debug("REST request to get all Groups");
        return groupExtRepository.findAllByUsers(userId);
    }
}

package org.createyourhumanity.angular.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourhumanity.angular.domain.Friendrequest;
import org.createyourhumanity.angular.repository.FriendrequestExtRepository;
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
public class FriendrequestExtResource {

    private final Logger log = LoggerFactory.getLogger(FriendrequestResource.class);

    private static final String ENTITY_NAME = "friendrequest";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FriendrequestExtRepository friendrequestExtRepository;

    public FriendrequestExtResource(FriendrequestExtRepository friendrequestExtRepository) {
        this.friendrequestExtRepository = friendrequestExtRepository;
    }



    /**
     * {@code GET  /friendrequests/:id} : get the "id" friendrequest.
     *
     * @param id the id of the friendrequest to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the friendrequest, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/friendrequests/{id}/findByRequestUserId")
    public List<Friendrequest> getFriendrequestByUserId(@PathVariable String id) {
        log.debug("REST request to get Friendrequest by userid: {}", id);
        List<Friendrequest> friendrequest = friendrequestExtRepository.findAllByRequestUserId(id);
        return friendrequest;
    }

}

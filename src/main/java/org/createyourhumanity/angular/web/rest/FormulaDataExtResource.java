package org.createyourhumanity.angular.web.rest;

import org.createyourhumanity.angular.domain.FormulaData;
import org.createyourhumanity.angular.repository.FormulaDataExtRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;


/**
 * REST controller for managing {@link org.createyourhumanity.angular.domain.FormulaData}.
 */
@RestController
@RequestMapping("/api")
public class FormulaDataExtResource {

    private final Logger log = LoggerFactory.getLogger(FormulaDataResource.class);

    private static final String ENTITY_NAME = "formulaData";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FormulaDataExtRepository formulaDataExtRepository;

    public FormulaDataExtResource(FormulaDataExtRepository formulaDataExtRepository) {
        this.formulaDataExtRepository = formulaDataExtRepository;
    }

    @GetMapping("/formula-data/{userId}/findByUserId")
    public FormulaData getUserMindmap(@PathVariable String userId) {
        log.debug("REST request to get FormulaData by UserId : {}", userId);
        FormulaData fd = formulaDataExtRepository.findByUser(userId);
        return fd;
    }

    @GetMapping("/formula-data/{userId}/{key}/getGrant")
    public String getGrant(@PathVariable String userId, @PathVariable String key) {
        log.debug("REST request to get grant by UserId : {}", userId);
        FormulaData fd = formulaDataExtRepository.findByUser(userId);
        String jsonGrant = fd.getGrant();
        ObjectMapper objectMapper = new ObjectMapper();
        String r = null;
        try {
            JsonNode rootNode = objectMapper.readTree(jsonGrant);
            r = rootNode.path(key).asText();
            if(r == null || r == "") {
                r = "ALL";
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return r;
    }

    @GetMapping("/formula-data/{userId}/{key}/getVisible")
    public String getVisible(@PathVariable String userId, @PathVariable String key) {
        log.debug("REST request to get grant by UserId : {}", userId);
        FormulaData fd = formulaDataExtRepository.findByUser(userId);
        String jsonGrant = fd.getVisible();
        ObjectMapper objectMapper = new ObjectMapper();
        String r = null;
        try {
            JsonNode rootNode = objectMapper.readTree(jsonGrant);
            r = rootNode.path(key).asText();
            if(r == null || r == "") {
                r = "visible_visible";
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return r;
    }

}

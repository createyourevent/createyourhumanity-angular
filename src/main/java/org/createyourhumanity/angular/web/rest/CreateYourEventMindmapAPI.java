package org.createyourhumanity.angular.web.rest;

import org.createyourhumanity.angular.service.CreateYourHumanityAPIService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CreateYourEventMindmapAPI {

    private final Logger log = LoggerFactory.getLogger(FormulaDataResource.class);

    public CreateYourHumanityAPIService createYourHumanityAPIService;

    public CreateYourEventMindmapAPI(CreateYourHumanityAPIService createYourHumanityAPIService) {
        this.createYourHumanityAPIService = createYourHumanityAPIService;
    }

    @GetMapping("/createyoureventAPI/{userId}/{id}findValueByUserIdAndId")
    public String getValueFromUserAndId(@PathVariable String userId, @PathVariable String id) {
        log.debug("REST request to get Value by UserId and Id from JSONMap : {}, {}", userId, id);
        String value = this.createYourHumanityAPIService.getValueForId(id, userId);
        return value;
    }

    @GetMapping("/createyoureventAPI/{userId}/{id}findGrantByUserIdAndId")
    public String getGrantFromUserAndId(@PathVariable String userId, @PathVariable String id) {
        log.debug("REST request to get Value by UserId and Id from JSONMap : {}, {}", userId, id);
        String value = this.createYourHumanityAPIService.getGrantForId(id, userId);
        return value;
    }
}

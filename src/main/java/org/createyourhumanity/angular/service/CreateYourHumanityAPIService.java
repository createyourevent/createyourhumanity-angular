package org.createyourhumanity.angular.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.createyourhumanity.angular.domain.FormulaData;
import org.createyourhumanity.angular.repository.FormulaDataExtRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class CreateYourHumanityAPIService {

    private final Logger log = LoggerFactory.getLogger(CreateYourHumanityAPIService.class);

    private final FormulaDataExtRepository formulaDataExtRepository;

    public CreateYourHumanityAPIService(FormulaDataExtRepository formulaDataExtRepository) {
        this.formulaDataExtRepository = formulaDataExtRepository;
    }

    public String getValueForId(String id, String userId) {
        log.debug("Service: getValueForId(String id): {}", id);
        FormulaData fd = this.formulaDataExtRepository.findByUser(userId);
        String jsonString = fd.getMap();
        JsonParser springParser = JsonParserFactory.getJsonParser();
        Map<String, Object> map = springParser.parseMap(jsonString);
        String mapArray[] = new String[map.size()];
        return mapArray[Integer.parseInt(id)];
    }

    public String getGrantForId(String id, String userId) {
        log.debug("Service: getGrantForId(String id): {}", id);
        FormulaData fd = this.formulaDataExtRepository.findByUser(userId);
        String jsonString = fd.getGrant();
        JsonParser springParser = JsonParserFactory.getJsonParser();
        Map<String, Object> map = springParser.parseMap(jsonString);
        String mapArray[] = new String[map.size()];
        return mapArray[Integer.parseInt(id)];
    }


}

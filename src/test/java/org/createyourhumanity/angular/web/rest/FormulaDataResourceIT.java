package org.createyourhumanity.angular.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.createyourhumanity.angular.web.rest.TestUtil.sameInstant;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import org.createyourhumanity.angular.IntegrationTest;
import org.createyourhumanity.angular.domain.FormulaData;
import org.createyourhumanity.angular.repository.FormulaDataRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link FormulaDataResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FormulaDataResourceIT {

    private static final String DEFAULT_MAP = "AAAAAAAAAA";
    private static final String UPDATED_MAP = "BBBBBBBBBB";

    private static final String DEFAULT_GRANT = "AAAAAAAAAA";
    private static final String UPDATED_GRANT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/formula-data";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private FormulaDataRepository formulaDataRepository;

    @Autowired
    private MockMvc restFormulaDataMockMvc;

    private FormulaData formulaData;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormulaData createEntity() {
        FormulaData formulaData = new FormulaData()
            .map(DEFAULT_MAP)
            .grant(DEFAULT_GRANT)
            .created(DEFAULT_CREATED)
            .modified(DEFAULT_MODIFIED);
        return formulaData;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormulaData createUpdatedEntity() {
        FormulaData formulaData = new FormulaData()
            .map(UPDATED_MAP)
            .grant(UPDATED_GRANT)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED);
        return formulaData;
    }

    @BeforeEach
    public void initTest() {
        formulaDataRepository.deleteAll();
        formulaData = createEntity();
    }

    @Test
    void createFormulaData() throws Exception {
        int databaseSizeBeforeCreate = formulaDataRepository.findAll().size();
        // Create the FormulaData
        restFormulaDataMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formulaData))
            )
            .andExpect(status().isCreated());

        // Validate the FormulaData in the database
        List<FormulaData> formulaDataList = formulaDataRepository.findAll();
        assertThat(formulaDataList).hasSize(databaseSizeBeforeCreate + 1);
        FormulaData testFormulaData = formulaDataList.get(formulaDataList.size() - 1);
        assertThat(testFormulaData.getMap()).isEqualTo(DEFAULT_MAP);
        assertThat(testFormulaData.getGrant()).isEqualTo(DEFAULT_GRANT);
        assertThat(testFormulaData.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testFormulaData.getModified()).isEqualTo(DEFAULT_MODIFIED);
    }

    @Test
    void createFormulaDataWithExistingId() throws Exception {
        // Create the FormulaData with an existing ID
        formulaData.setId("existing_id");

        int databaseSizeBeforeCreate = formulaDataRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFormulaDataMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formulaData))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormulaData in the database
        List<FormulaData> formulaDataList = formulaDataRepository.findAll();
        assertThat(formulaDataList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllFormulaData() throws Exception {
        // Initialize the database
        formulaDataRepository.save(formulaData);

        // Get all the formulaDataList
        restFormulaDataMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(formulaData.getId())))
            .andExpect(jsonPath("$.[*].map").value(hasItem(DEFAULT_MAP)))
            .andExpect(jsonPath("$.[*].grant").value(hasItem(DEFAULT_GRANT)))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    void getFormulaData() throws Exception {
        // Initialize the database
        formulaDataRepository.save(formulaData);

        // Get the formulaData
        restFormulaDataMockMvc
            .perform(get(ENTITY_API_URL_ID, formulaData.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(formulaData.getId()))
            .andExpect(jsonPath("$.map").value(DEFAULT_MAP))
            .andExpect(jsonPath("$.grant").value(DEFAULT_GRANT))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.modified").value(sameInstant(DEFAULT_MODIFIED)));
    }

    @Test
    void getNonExistingFormulaData() throws Exception {
        // Get the formulaData
        restFormulaDataMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewFormulaData() throws Exception {
        // Initialize the database
        formulaDataRepository.save(formulaData);

        int databaseSizeBeforeUpdate = formulaDataRepository.findAll().size();

        // Update the formulaData
        FormulaData updatedFormulaData = formulaDataRepository.findById(formulaData.getId()).get();
        updatedFormulaData.map(UPDATED_MAP).grant(UPDATED_GRANT).created(UPDATED_CREATED).modified(UPDATED_MODIFIED);

        restFormulaDataMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFormulaData.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFormulaData))
            )
            .andExpect(status().isOk());

        // Validate the FormulaData in the database
        List<FormulaData> formulaDataList = formulaDataRepository.findAll();
        assertThat(formulaDataList).hasSize(databaseSizeBeforeUpdate);
        FormulaData testFormulaData = formulaDataList.get(formulaDataList.size() - 1);
        assertThat(testFormulaData.getMap()).isEqualTo(UPDATED_MAP);
        assertThat(testFormulaData.getGrant()).isEqualTo(UPDATED_GRANT);
        assertThat(testFormulaData.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testFormulaData.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    void putNonExistingFormulaData() throws Exception {
        int databaseSizeBeforeUpdate = formulaDataRepository.findAll().size();
        formulaData.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormulaDataMockMvc
            .perform(
                put(ENTITY_API_URL_ID, formulaData.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formulaData))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormulaData in the database
        List<FormulaData> formulaDataList = formulaDataRepository.findAll();
        assertThat(formulaDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchFormulaData() throws Exception {
        int databaseSizeBeforeUpdate = formulaDataRepository.findAll().size();
        formulaData.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormulaDataMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formulaData))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormulaData in the database
        List<FormulaData> formulaDataList = formulaDataRepository.findAll();
        assertThat(formulaDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamFormulaData() throws Exception {
        int databaseSizeBeforeUpdate = formulaDataRepository.findAll().size();
        formulaData.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormulaDataMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formulaData))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormulaData in the database
        List<FormulaData> formulaDataList = formulaDataRepository.findAll();
        assertThat(formulaDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateFormulaDataWithPatch() throws Exception {
        // Initialize the database
        formulaDataRepository.save(formulaData);

        int databaseSizeBeforeUpdate = formulaDataRepository.findAll().size();

        // Update the formulaData using partial update
        FormulaData partialUpdatedFormulaData = new FormulaData();
        partialUpdatedFormulaData.setId(formulaData.getId());

        partialUpdatedFormulaData.created(UPDATED_CREATED).modified(UPDATED_MODIFIED);

        restFormulaDataMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormulaData.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormulaData))
            )
            .andExpect(status().isOk());

        // Validate the FormulaData in the database
        List<FormulaData> formulaDataList = formulaDataRepository.findAll();
        assertThat(formulaDataList).hasSize(databaseSizeBeforeUpdate);
        FormulaData testFormulaData = formulaDataList.get(formulaDataList.size() - 1);
        assertThat(testFormulaData.getMap()).isEqualTo(DEFAULT_MAP);
        assertThat(testFormulaData.getGrant()).isEqualTo(DEFAULT_GRANT);
        assertThat(testFormulaData.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testFormulaData.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    void fullUpdateFormulaDataWithPatch() throws Exception {
        // Initialize the database
        formulaDataRepository.save(formulaData);

        int databaseSizeBeforeUpdate = formulaDataRepository.findAll().size();

        // Update the formulaData using partial update
        FormulaData partialUpdatedFormulaData = new FormulaData();
        partialUpdatedFormulaData.setId(formulaData.getId());

        partialUpdatedFormulaData.map(UPDATED_MAP).grant(UPDATED_GRANT).created(UPDATED_CREATED).modified(UPDATED_MODIFIED);

        restFormulaDataMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormulaData.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormulaData))
            )
            .andExpect(status().isOk());

        // Validate the FormulaData in the database
        List<FormulaData> formulaDataList = formulaDataRepository.findAll();
        assertThat(formulaDataList).hasSize(databaseSizeBeforeUpdate);
        FormulaData testFormulaData = formulaDataList.get(formulaDataList.size() - 1);
        assertThat(testFormulaData.getMap()).isEqualTo(UPDATED_MAP);
        assertThat(testFormulaData.getGrant()).isEqualTo(UPDATED_GRANT);
        assertThat(testFormulaData.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testFormulaData.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    void patchNonExistingFormulaData() throws Exception {
        int databaseSizeBeforeUpdate = formulaDataRepository.findAll().size();
        formulaData.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormulaDataMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, formulaData.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formulaData))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormulaData in the database
        List<FormulaData> formulaDataList = formulaDataRepository.findAll();
        assertThat(formulaDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchFormulaData() throws Exception {
        int databaseSizeBeforeUpdate = formulaDataRepository.findAll().size();
        formulaData.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormulaDataMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formulaData))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormulaData in the database
        List<FormulaData> formulaDataList = formulaDataRepository.findAll();
        assertThat(formulaDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamFormulaData() throws Exception {
        int databaseSizeBeforeUpdate = formulaDataRepository.findAll().size();
        formulaData.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormulaDataMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formulaData))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormulaData in the database
        List<FormulaData> formulaDataList = formulaDataRepository.findAll();
        assertThat(formulaDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteFormulaData() throws Exception {
        // Initialize the database
        formulaDataRepository.save(formulaData);

        int databaseSizeBeforeDelete = formulaDataRepository.findAll().size();

        // Delete the formulaData
        restFormulaDataMockMvc
            .perform(delete(ENTITY_API_URL_ID, formulaData.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FormulaData> formulaDataList = formulaDataRepository.findAll();
        assertThat(formulaDataList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

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
import org.createyourhumanity.angular.domain.UserMindmap;
import org.createyourhumanity.angular.repository.UserMindmapRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link UserMindmapResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserMindmapResourceIT {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/user-mindmaps";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private UserMindmapRepository userMindmapRepository;

    @Autowired
    private MockMvc restUserMindmapMockMvc;

    private UserMindmap userMindmap;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserMindmap createEntity() {
        UserMindmap userMindmap = new UserMindmap().text(DEFAULT_TEXT).modified(DEFAULT_MODIFIED);
        return userMindmap;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserMindmap createUpdatedEntity() {
        UserMindmap userMindmap = new UserMindmap().text(UPDATED_TEXT).modified(UPDATED_MODIFIED);
        return userMindmap;
    }

    @BeforeEach
    public void initTest() {
        userMindmapRepository.deleteAll();
        userMindmap = createEntity();
    }

    @Test
    void createUserMindmap() throws Exception {
        int databaseSizeBeforeCreate = userMindmapRepository.findAll().size();
        // Create the UserMindmap
        restUserMindmapMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userMindmap))
            )
            .andExpect(status().isCreated());

        // Validate the UserMindmap in the database
        List<UserMindmap> userMindmapList = userMindmapRepository.findAll();
        assertThat(userMindmapList).hasSize(databaseSizeBeforeCreate + 1);
        UserMindmap testUserMindmap = userMindmapList.get(userMindmapList.size() - 1);
        assertThat(testUserMindmap.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testUserMindmap.getModified()).isEqualTo(DEFAULT_MODIFIED);
    }

    @Test
    void createUserMindmapWithExistingId() throws Exception {
        // Create the UserMindmap with an existing ID
        userMindmap.setId("existing_id");

        int databaseSizeBeforeCreate = userMindmapRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserMindmapMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userMindmap))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserMindmap in the database
        List<UserMindmap> userMindmapList = userMindmapRepository.findAll();
        assertThat(userMindmapList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllUserMindmaps() throws Exception {
        // Initialize the database
        userMindmapRepository.save(userMindmap);

        // Get all the userMindmapList
        restUserMindmapMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userMindmap.getId())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT)))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    void getUserMindmap() throws Exception {
        // Initialize the database
        userMindmapRepository.save(userMindmap);

        // Get the userMindmap
        restUserMindmapMockMvc
            .perform(get(ENTITY_API_URL_ID, userMindmap.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userMindmap.getId()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT))
            .andExpect(jsonPath("$.modified").value(sameInstant(DEFAULT_MODIFIED)));
    }

    @Test
    void getNonExistingUserMindmap() throws Exception {
        // Get the userMindmap
        restUserMindmapMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewUserMindmap() throws Exception {
        // Initialize the database
        userMindmapRepository.save(userMindmap);

        int databaseSizeBeforeUpdate = userMindmapRepository.findAll().size();

        // Update the userMindmap
        UserMindmap updatedUserMindmap = userMindmapRepository.findById(userMindmap.getId()).get();
        updatedUserMindmap.text(UPDATED_TEXT).modified(UPDATED_MODIFIED);

        restUserMindmapMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserMindmap.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserMindmap))
            )
            .andExpect(status().isOk());

        // Validate the UserMindmap in the database
        List<UserMindmap> userMindmapList = userMindmapRepository.findAll();
        assertThat(userMindmapList).hasSize(databaseSizeBeforeUpdate);
        UserMindmap testUserMindmap = userMindmapList.get(userMindmapList.size() - 1);
        assertThat(testUserMindmap.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testUserMindmap.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    void putNonExistingUserMindmap() throws Exception {
        int databaseSizeBeforeUpdate = userMindmapRepository.findAll().size();
        userMindmap.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserMindmapMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userMindmap.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userMindmap))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserMindmap in the database
        List<UserMindmap> userMindmapList = userMindmapRepository.findAll();
        assertThat(userMindmapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchUserMindmap() throws Exception {
        int databaseSizeBeforeUpdate = userMindmapRepository.findAll().size();
        userMindmap.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserMindmapMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userMindmap))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserMindmap in the database
        List<UserMindmap> userMindmapList = userMindmapRepository.findAll();
        assertThat(userMindmapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamUserMindmap() throws Exception {
        int databaseSizeBeforeUpdate = userMindmapRepository.findAll().size();
        userMindmap.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserMindmapMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userMindmap))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserMindmap in the database
        List<UserMindmap> userMindmapList = userMindmapRepository.findAll();
        assertThat(userMindmapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateUserMindmapWithPatch() throws Exception {
        // Initialize the database
        userMindmapRepository.save(userMindmap);

        int databaseSizeBeforeUpdate = userMindmapRepository.findAll().size();

        // Update the userMindmap using partial update
        UserMindmap partialUpdatedUserMindmap = new UserMindmap();
        partialUpdatedUserMindmap.setId(userMindmap.getId());

        partialUpdatedUserMindmap.text(UPDATED_TEXT);

        restUserMindmapMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserMindmap.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserMindmap))
            )
            .andExpect(status().isOk());

        // Validate the UserMindmap in the database
        List<UserMindmap> userMindmapList = userMindmapRepository.findAll();
        assertThat(userMindmapList).hasSize(databaseSizeBeforeUpdate);
        UserMindmap testUserMindmap = userMindmapList.get(userMindmapList.size() - 1);
        assertThat(testUserMindmap.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testUserMindmap.getModified()).isEqualTo(DEFAULT_MODIFIED);
    }

    @Test
    void fullUpdateUserMindmapWithPatch() throws Exception {
        // Initialize the database
        userMindmapRepository.save(userMindmap);

        int databaseSizeBeforeUpdate = userMindmapRepository.findAll().size();

        // Update the userMindmap using partial update
        UserMindmap partialUpdatedUserMindmap = new UserMindmap();
        partialUpdatedUserMindmap.setId(userMindmap.getId());

        partialUpdatedUserMindmap.text(UPDATED_TEXT).modified(UPDATED_MODIFIED);

        restUserMindmapMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserMindmap.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserMindmap))
            )
            .andExpect(status().isOk());

        // Validate the UserMindmap in the database
        List<UserMindmap> userMindmapList = userMindmapRepository.findAll();
        assertThat(userMindmapList).hasSize(databaseSizeBeforeUpdate);
        UserMindmap testUserMindmap = userMindmapList.get(userMindmapList.size() - 1);
        assertThat(testUserMindmap.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testUserMindmap.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    void patchNonExistingUserMindmap() throws Exception {
        int databaseSizeBeforeUpdate = userMindmapRepository.findAll().size();
        userMindmap.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserMindmapMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userMindmap.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userMindmap))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserMindmap in the database
        List<UserMindmap> userMindmapList = userMindmapRepository.findAll();
        assertThat(userMindmapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchUserMindmap() throws Exception {
        int databaseSizeBeforeUpdate = userMindmapRepository.findAll().size();
        userMindmap.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserMindmapMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userMindmap))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserMindmap in the database
        List<UserMindmap> userMindmapList = userMindmapRepository.findAll();
        assertThat(userMindmapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamUserMindmap() throws Exception {
        int databaseSizeBeforeUpdate = userMindmapRepository.findAll().size();
        userMindmap.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserMindmapMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userMindmap))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserMindmap in the database
        List<UserMindmap> userMindmapList = userMindmapRepository.findAll();
        assertThat(userMindmapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteUserMindmap() throws Exception {
        // Initialize the database
        userMindmapRepository.save(userMindmap);

        int databaseSizeBeforeDelete = userMindmapRepository.findAll().size();

        // Delete the userMindmap
        restUserMindmapMockMvc
            .perform(delete(ENTITY_API_URL_ID, userMindmap.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserMindmap> userMindmapList = userMindmapRepository.findAll();
        assertThat(userMindmapList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

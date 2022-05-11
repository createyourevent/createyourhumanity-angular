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
import org.createyourhumanity.angular.domain.Friendrequest;
import org.createyourhumanity.angular.repository.FriendrequestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link FriendrequestResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FriendrequestResourceIT {

    private static final ZonedDateTime DEFAULT_REQUEST_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_REQUEST_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_REQUEST_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_REQUEST_USER_ID = "BBBBBBBBBB";

    private static final String DEFAULT_INFO = "AAAAAAAAAA";
    private static final String UPDATED_INFO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/friendrequests";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private FriendrequestRepository friendrequestRepository;

    @Autowired
    private MockMvc restFriendrequestMockMvc;

    private Friendrequest friendrequest;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Friendrequest createEntity() {
        Friendrequest friendrequest = new Friendrequest()
            .requestDate(DEFAULT_REQUEST_DATE)
            .requestUserId(DEFAULT_REQUEST_USER_ID)
            .info(DEFAULT_INFO);
        return friendrequest;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Friendrequest createUpdatedEntity() {
        Friendrequest friendrequest = new Friendrequest()
            .requestDate(UPDATED_REQUEST_DATE)
            .requestUserId(UPDATED_REQUEST_USER_ID)
            .info(UPDATED_INFO);
        return friendrequest;
    }

    @BeforeEach
    public void initTest() {
        friendrequestRepository.deleteAll();
        friendrequest = createEntity();
    }

    @Test
    void createFriendrequest() throws Exception {
        int databaseSizeBeforeCreate = friendrequestRepository.findAll().size();
        // Create the Friendrequest
        restFriendrequestMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(friendrequest))
            )
            .andExpect(status().isCreated());

        // Validate the Friendrequest in the database
        List<Friendrequest> friendrequestList = friendrequestRepository.findAll();
        assertThat(friendrequestList).hasSize(databaseSizeBeforeCreate + 1);
        Friendrequest testFriendrequest = friendrequestList.get(friendrequestList.size() - 1);
        assertThat(testFriendrequest.getRequestDate()).isEqualTo(DEFAULT_REQUEST_DATE);
        assertThat(testFriendrequest.getRequestUserId()).isEqualTo(DEFAULT_REQUEST_USER_ID);
        assertThat(testFriendrequest.getInfo()).isEqualTo(DEFAULT_INFO);
    }

    @Test
    void createFriendrequestWithExistingId() throws Exception {
        // Create the Friendrequest with an existing ID
        friendrequest.setId("existing_id");

        int databaseSizeBeforeCreate = friendrequestRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFriendrequestMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(friendrequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the Friendrequest in the database
        List<Friendrequest> friendrequestList = friendrequestRepository.findAll();
        assertThat(friendrequestList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllFriendrequests() throws Exception {
        // Initialize the database
        friendrequestRepository.save(friendrequest);

        // Get all the friendrequestList
        restFriendrequestMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(friendrequest.getId())))
            .andExpect(jsonPath("$.[*].requestDate").value(hasItem(sameInstant(DEFAULT_REQUEST_DATE))))
            .andExpect(jsonPath("$.[*].requestUserId").value(hasItem(DEFAULT_REQUEST_USER_ID)))
            .andExpect(jsonPath("$.[*].info").value(hasItem(DEFAULT_INFO.toString())));
    }

    @Test
    void getFriendrequest() throws Exception {
        // Initialize the database
        friendrequestRepository.save(friendrequest);

        // Get the friendrequest
        restFriendrequestMockMvc
            .perform(get(ENTITY_API_URL_ID, friendrequest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(friendrequest.getId()))
            .andExpect(jsonPath("$.requestDate").value(sameInstant(DEFAULT_REQUEST_DATE)))
            .andExpect(jsonPath("$.requestUserId").value(DEFAULT_REQUEST_USER_ID))
            .andExpect(jsonPath("$.info").value(DEFAULT_INFO.toString()));
    }

    @Test
    void getNonExistingFriendrequest() throws Exception {
        // Get the friendrequest
        restFriendrequestMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewFriendrequest() throws Exception {
        // Initialize the database
        friendrequestRepository.save(friendrequest);

        int databaseSizeBeforeUpdate = friendrequestRepository.findAll().size();

        // Update the friendrequest
        Friendrequest updatedFriendrequest = friendrequestRepository.findById(friendrequest.getId()).get();
        updatedFriendrequest.requestDate(UPDATED_REQUEST_DATE).requestUserId(UPDATED_REQUEST_USER_ID).info(UPDATED_INFO);

        restFriendrequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFriendrequest.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFriendrequest))
            )
            .andExpect(status().isOk());

        // Validate the Friendrequest in the database
        List<Friendrequest> friendrequestList = friendrequestRepository.findAll();
        assertThat(friendrequestList).hasSize(databaseSizeBeforeUpdate);
        Friendrequest testFriendrequest = friendrequestList.get(friendrequestList.size() - 1);
        assertThat(testFriendrequest.getRequestDate()).isEqualTo(UPDATED_REQUEST_DATE);
        assertThat(testFriendrequest.getRequestUserId()).isEqualTo(UPDATED_REQUEST_USER_ID);
        assertThat(testFriendrequest.getInfo()).isEqualTo(UPDATED_INFO);
    }

    @Test
    void putNonExistingFriendrequest() throws Exception {
        int databaseSizeBeforeUpdate = friendrequestRepository.findAll().size();
        friendrequest.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFriendrequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, friendrequest.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(friendrequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the Friendrequest in the database
        List<Friendrequest> friendrequestList = friendrequestRepository.findAll();
        assertThat(friendrequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchFriendrequest() throws Exception {
        int databaseSizeBeforeUpdate = friendrequestRepository.findAll().size();
        friendrequest.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFriendrequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(friendrequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the Friendrequest in the database
        List<Friendrequest> friendrequestList = friendrequestRepository.findAll();
        assertThat(friendrequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamFriendrequest() throws Exception {
        int databaseSizeBeforeUpdate = friendrequestRepository.findAll().size();
        friendrequest.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFriendrequestMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(friendrequest))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Friendrequest in the database
        List<Friendrequest> friendrequestList = friendrequestRepository.findAll();
        assertThat(friendrequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateFriendrequestWithPatch() throws Exception {
        // Initialize the database
        friendrequestRepository.save(friendrequest);

        int databaseSizeBeforeUpdate = friendrequestRepository.findAll().size();

        // Update the friendrequest using partial update
        Friendrequest partialUpdatedFriendrequest = new Friendrequest();
        partialUpdatedFriendrequest.setId(friendrequest.getId());

        partialUpdatedFriendrequest.requestDate(UPDATED_REQUEST_DATE);

        restFriendrequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFriendrequest.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFriendrequest))
            )
            .andExpect(status().isOk());

        // Validate the Friendrequest in the database
        List<Friendrequest> friendrequestList = friendrequestRepository.findAll();
        assertThat(friendrequestList).hasSize(databaseSizeBeforeUpdate);
        Friendrequest testFriendrequest = friendrequestList.get(friendrequestList.size() - 1);
        assertThat(testFriendrequest.getRequestDate()).isEqualTo(UPDATED_REQUEST_DATE);
        assertThat(testFriendrequest.getRequestUserId()).isEqualTo(DEFAULT_REQUEST_USER_ID);
        assertThat(testFriendrequest.getInfo()).isEqualTo(DEFAULT_INFO);
    }

    @Test
    void fullUpdateFriendrequestWithPatch() throws Exception {
        // Initialize the database
        friendrequestRepository.save(friendrequest);

        int databaseSizeBeforeUpdate = friendrequestRepository.findAll().size();

        // Update the friendrequest using partial update
        Friendrequest partialUpdatedFriendrequest = new Friendrequest();
        partialUpdatedFriendrequest.setId(friendrequest.getId());

        partialUpdatedFriendrequest.requestDate(UPDATED_REQUEST_DATE).requestUserId(UPDATED_REQUEST_USER_ID).info(UPDATED_INFO);

        restFriendrequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFriendrequest.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFriendrequest))
            )
            .andExpect(status().isOk());

        // Validate the Friendrequest in the database
        List<Friendrequest> friendrequestList = friendrequestRepository.findAll();
        assertThat(friendrequestList).hasSize(databaseSizeBeforeUpdate);
        Friendrequest testFriendrequest = friendrequestList.get(friendrequestList.size() - 1);
        assertThat(testFriendrequest.getRequestDate()).isEqualTo(UPDATED_REQUEST_DATE);
        assertThat(testFriendrequest.getRequestUserId()).isEqualTo(UPDATED_REQUEST_USER_ID);
        assertThat(testFriendrequest.getInfo()).isEqualTo(UPDATED_INFO);
    }

    @Test
    void patchNonExistingFriendrequest() throws Exception {
        int databaseSizeBeforeUpdate = friendrequestRepository.findAll().size();
        friendrequest.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFriendrequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, friendrequest.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(friendrequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the Friendrequest in the database
        List<Friendrequest> friendrequestList = friendrequestRepository.findAll();
        assertThat(friendrequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchFriendrequest() throws Exception {
        int databaseSizeBeforeUpdate = friendrequestRepository.findAll().size();
        friendrequest.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFriendrequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(friendrequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the Friendrequest in the database
        List<Friendrequest> friendrequestList = friendrequestRepository.findAll();
        assertThat(friendrequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamFriendrequest() throws Exception {
        int databaseSizeBeforeUpdate = friendrequestRepository.findAll().size();
        friendrequest.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFriendrequestMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(friendrequest))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Friendrequest in the database
        List<Friendrequest> friendrequestList = friendrequestRepository.findAll();
        assertThat(friendrequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteFriendrequest() throws Exception {
        // Initialize the database
        friendrequestRepository.save(friendrequest);

        int databaseSizeBeforeDelete = friendrequestRepository.findAll().size();

        // Delete the friendrequest
        restFriendrequestMockMvc
            .perform(delete(ENTITY_API_URL_ID, friendrequest.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Friendrequest> friendrequestList = friendrequestRepository.findAll();
        assertThat(friendrequestList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

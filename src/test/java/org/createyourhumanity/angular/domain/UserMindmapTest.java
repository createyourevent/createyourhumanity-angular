package org.createyourhumanity.angular.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourhumanity.angular.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserMindmapTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserMindmap.class);
        UserMindmap userMindmap1 = new UserMindmap();
        userMindmap1.setId("id1");
        UserMindmap userMindmap2 = new UserMindmap();
        userMindmap2.setId(userMindmap1.getId());
        assertThat(userMindmap1).isEqualTo(userMindmap2);
        userMindmap2.setId("id2");
        assertThat(userMindmap1).isNotEqualTo(userMindmap2);
        userMindmap1.setId(null);
        assertThat(userMindmap1).isNotEqualTo(userMindmap2);
    }
}

package org.createyourhumanity.angular.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourhumanity.angular.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FriendrequestTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Friendrequest.class);
        Friendrequest friendrequest1 = new Friendrequest();
        friendrequest1.setId("id1");
        Friendrequest friendrequest2 = new Friendrequest();
        friendrequest2.setId(friendrequest1.getId());
        assertThat(friendrequest1).isEqualTo(friendrequest2);
        friendrequest2.setId("id2");
        assertThat(friendrequest1).isNotEqualTo(friendrequest2);
        friendrequest1.setId(null);
        assertThat(friendrequest1).isNotEqualTo(friendrequest2);
    }
}

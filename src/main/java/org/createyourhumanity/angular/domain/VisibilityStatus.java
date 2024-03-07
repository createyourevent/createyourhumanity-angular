package org.createyourhumanity.angular.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A VisibilityStatus.
 */
@Document(collection = "visibility_status")
public class VisibilityStatus implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("map")
    private String map;

    @Field("created")
    private ZonedDateTime created;

    @Field("modified")
    private ZonedDateTime modified;

    @DBRef
    @Field("user")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public VisibilityStatus id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMap() {
        return this.map;
    }

    public VisibilityStatus map(String map) {
        this.setMap(map);
        return this;
    }

    public void setMap(String map) {
        this.map = map;
    }

    public ZonedDateTime getCreated() {
        return this.created;
    }

    public VisibilityStatus created(ZonedDateTime created) {
        this.setCreated(created);
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getModified() {
        return this.modified;
    }

    public VisibilityStatus modified(ZonedDateTime modified) {
        this.setModified(modified);
        return this;
    }

    public void setModified(ZonedDateTime modified) {
        this.modified = modified;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VisibilityStatus)) {
            return false;
        }
        return id != null && id.equals(((VisibilityStatus) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VisibilityStatus{" +
            "id=" + getId() +
            ", map='" + getMap() + "'" +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            "}";
    }
}

package org.createyourhumanity.angular.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A UserDetails.
 */
@Document(collection = "user_details")
public class UserDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("points")
    private Integer points;

    @Field("address")
    private String address;

    @Field("dob")
    private ZonedDateTime dob;

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

    public UserDetails id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getPoints() {
        return this.points;
    }

    public UserDetails points(Integer points) {
        this.setPoints(points);
        return this;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public String getAddress() {
        return this.address;
    }

    public UserDetails address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public ZonedDateTime getDob() {
        return this.dob;
    }

    public UserDetails dob(ZonedDateTime dob) {
        this.setDob(dob);
        return this;
    }

    public void setDob(ZonedDateTime dob) {
        this.dob = dob;
    }

    public ZonedDateTime getCreated() {
        return this.created;
    }

    public UserDetails created(ZonedDateTime created) {
        this.setCreated(created);
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getModified() {
        return this.modified;
    }

    public UserDetails modified(ZonedDateTime modified) {
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

    public UserDetails user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserDetails)) {
            return false;
        }
        return id != null && id.equals(((UserDetails) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserDetails{" +
            "id=" + getId() +
            ", points=" + getPoints() +
            ", address='" + getAddress() + "'" +
            ", dob='" + getDob() + "'" +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            "}";
    }
}

package org.createyourhumanity.angular.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.jackson.annotation.JsonBackReference;

/**
 * A FormulaData.
 */
@Document(collection = "formula_data")
public class FormulaData implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("map")
    private String map;

    @Field("grant")
    private String grant;

    @Field("group")
    private String group;

    @Field("visible")
    private String visible;

    @Field("created")
    private ZonedDateTime created;

    @Field("modified")
    private ZonedDateTime modified;

    @DBRef
    @Field("user")
    @JsonBackReference
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public FormulaData id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMap() {
        return this.map;
    }

    public FormulaData map(String map) {
        this.setMap(map);
        return this;
    }

    public void setMap(String map) {
        this.map = map;
    }

    public String getGrant() {
        return this.grant;
    }

    public FormulaData grant(String grant) {
        this.setGrant(grant);
        return this;
    }

    public void setGrant(String grant) {
        this.grant = grant;
    }

    public String getGroup() {
        return this.group;
    }

    public FormulaData group(String group) {
        this.setGroup(group);
        return this;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public String getVisible() {
        return this.visible;
    }

    public FormulaData visible(String visible) {
        this.setVisible(visible);
        return this;
    }

    public void setVisible(String visible) {
        this.visible = visible;
    }

    public ZonedDateTime getCreated() {
        return this.created;
    }

    public FormulaData created(ZonedDateTime created) {
        this.setCreated(created);
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getModified() {
        return this.modified;
    }

    public FormulaData modified(ZonedDateTime modified) {
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

    public FormulaData user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FormulaData)) {
            return false;
        }
        return id != null && id.equals(((FormulaData) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FormulaData{" +
            "id=" + getId() +
            ", map='" + getMap() + "'" +
            ", grant='" + getGrant() + "'" +
            ", group='" + getGroup() + "'" +
            ", visible='" + getVisible() + "'" +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            "}";
    }
}

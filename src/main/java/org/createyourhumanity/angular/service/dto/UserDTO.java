package org.createyourhumanity.angular.service.dto;

import java.util.List;

import org.createyourhumanity.angular.domain.FormulaData;
import org.createyourhumanity.angular.domain.Friends;
import org.createyourhumanity.angular.domain.User;

/**
 * A DTO representing a user, with only the public attributes.
 */
public class UserDTO {

    private String id;

    private String login;

    private String firstName;

    private String lastName;

    private String imageUrl;

    private FormulaData formulaData;

    private List<Friends> friends;

    private String description;

    public UserDTO() {
        // Empty constructor needed for Jackson.
    }

    public UserDTO(User user) {
        this.id = user.getId();
        // Customize it here if you need, or not, firstName/lastName/etc
        this.login = user.getLogin();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.imageUrl = user.getImageUrl();
        this.formulaData = new FormulaData();
        this.friends = user.getFriends();
        this.description = user.getDescription();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public FormulaData getFormulaData() {
        return formulaData;
    }

    public void setFormulaData(FormulaData formulaData) {
        this.formulaData = formulaData;
    }

    public List<Friends> getFriends() {
        return friends;
    }

    public void setFriends(List<Friends> friends) {
        this.friends = friends;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserDTO{" +
            "id='" + id + '\'' +
            ", login='" + login + '\'' +
            ", description='" + description + '\'' +
            "}";
    }
}

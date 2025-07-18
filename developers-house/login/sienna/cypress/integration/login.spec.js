/// <reference types="cypress" />

context("Login", () => {
    it("Redirect to the error page if no login_challenge is specified", () => {
        cy.visit("/login");
        cy.location('pathname').should('eq', '/dialog/error');
        cy.contains("Login challenge should be specified.").should("exist");
    });

    it("Displays the returned data from the API and redirected to the right place.", () => {
        cy.intercept("GET", "**/api/login*", {
            fixture: "login_init",
        }).as("getLoginSession");
        cy.visit("/login?login_challenge=123");

        cy.wait("@getLoginSession");

        cy.contains("fake cypress")
            .should("exist");
        cy.contains("cypress auth")
            .should("have.css", "background-color", "rgb(0, 128, 0)")
            .click();
        cy.location('pathname').should('eq', '/dialog/__test/success');
    });

    it("Redirect when the user is logged in", () => {
        cy.intercept("GET", "**/api/login*", {
            fixture: "login_continue",
        }).as("getLoginSession");
        cy.visit("/login?login_challenge=123");

        cy.wait("@getLoginSession");

        cy.location('pathname').should('eq', '/dialog/__test/success');
    });
});
/// <reference types="cypress" />

context("Consent", () => {
    it("Redirect to the error page if no consent_challenge is specified", () => {
        cy.visit("/consent");
        cy.location('pathname').should('eq', '/dialog/error');
        cy.contains("Consent challenge should be specified.").should("exist");
    });

    it("Displays the returned data from the API and redirected to the right place.", () => {
        cy.visit("/consent?consent_challenge=123");
        cy.intercept("GET", "**/api/consent*", {
            fixture: "consent_init.json",
        }).as("getLoginSession");

        cy.contains("fakeClient")
            .should("exist");

        cy.contains("fake1").should("exist");
        cy.contains("fake2").should("exist");
        cy.contains("Accept").should("exist");
        cy.contains("Reject").should("exist");
    });

    it("Rejects the request on clicked", () => {
        cy.visit("/consent?consent_challenge=123");
        cy.intercept("GET", "**/api/consent*", {
            fixture: "consent_init.json",
        }).as("getLoginSession");

        cy.intercept("POST", "**/api/consent*", {
            fixture: "consent_accept.json",
        }).as("postResult");

        cy.contains("Reject")
            .should("exist")
            .click();

        cy.wait('@postResult').should(({ request, response }) => {
            expect(request && request.body)
                .to.have.property('granted', false);
        })

        cy.location('pathname').should('eq', '/dialog/__test/success');
    });

    it("Accept the request on clicked", () => {
        cy.visit("/consent?consent_challenge=123");
        cy.intercept("GET", "**/api/consent*", {
            fixture: "consent_init.json",
        }).as("getLoginSession");

        cy.intercept("POST", "**/api/consent*", {
            fixture: "consent_accept.json",
        }).as("postResult");

        cy.contains("Accept")
            .should("exist")
            .click();

        cy.wait('@postResult').should(({ request, response }) => {
            expect(request && request.body)
                .to.have.property('granted', true);
        })

        cy.location('pathname').should('eq', '/dialog/__test/success');
    });
});
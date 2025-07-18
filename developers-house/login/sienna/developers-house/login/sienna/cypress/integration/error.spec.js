/// <reference types="cypress" />

context("Error", () => {

    it('diaplays the generic error message for the /dialog/error route', () => {
        cy.visit("/error", {
            failOnStatusCode: false,
        });
        const test = () => {
            cy.contains("There might be a problem with our system. Check the page you were before and report the error to us. If you have any error below it can be helpful to resolve the issue you encountered.")
                .should("exist");
        };
        test();
        cy.visit("/random_route", {
            failOnStatusCode: false,
        });
        test();
    });

    it('diaplays the generic error message for the /dialog/error route', () => {

        const message = Math.random() * 40;

        cy.visit("/error?error_message=" + message, {
            failOnStatusCode: false,
        });
        cy.contains(message).should("exist");

        cy.visit("/error?error_description=" + message, {
            failOnStatusCode: false,
        });

        cy.contains(message).should("exist");

        cy.visit("/error?message=" + message, {
            failOnStatusCode: false,
        });

        cy.contains(message).should("exist");
    });
});
/// <reference types="cypress" />

context("Theme changer", () => {

    beforeEach(() => {
        cy.reload();
    });

    it("Loads the light theme by default", () => {
        cy.visit("/", {
            failOnStatusCode: false,
        });

        cy.get('#__next > div')
            .should(($div) => {
                expect($div).to.have.length(1)
                const className = $div[0].className;
                expect(className).to.match(/light/)
            });
    });

    it("Contains the switch theme button", () => {
        cy.contains("Change theme")
            .should("exist");
    });

    it("Change the class of the main container on click", () => {
        cy.contains("Change theme")
            .should("exist")
            .click();

        cy.get('#__next > div')
            .should(($div) => {
                expect($div).to.have.length(1)
                const className = $div[0].className;
                expect(className).to.match(/dark/)
            });
        cy.getCookie("theme")
            .should('have.property', 'value', 'dark');
    });

    it("Persist the change between reloads", () => {
        cy.contains("Change theme")
            .should("exist")
            .click();

        cy.reload();

        cy.get('#__next > div')
            .should(($div) => {
                expect($div).to.have.length(1)
                const className = $div[0].className;
                expect(className).to.match(/dark/)
            });
    });

    it('Works a random amount of time', () => {
        const number = Math.floor(Math.random() * 10);
        const a = cy.contains("Change theme")
            .should("exist")
        for (let i = 0; i < number; i++) {
            a.click();
        }
        cy.get('#__next > div')
            .should(($div) => {
                expect($div).to.have.length(1)
                const className = $div[0].className;
                expect(className).to.match(number % 2 !== 0 ? /dark/ : /light/)
            });
    });

});
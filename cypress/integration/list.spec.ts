describe('List', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');

    cy.request('jobs.json').as('getJobs');
  });

  it('should display list', () => {
    cy.get('[data-test-id="Listings__JobList"]');
  });

  it('should open dialog on list item click', () => {
    cy.get('[data-test-id="JobListItem"]')
      .first()
      .click();

    cy.get('[data-test-id="JobDialog"]');
  });
});

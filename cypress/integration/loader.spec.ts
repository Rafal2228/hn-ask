describe('Loader', () => {
  it('should display loader', () => {
    cy.visit('http://localhost:3000');
    const loader = cy.get('[data-test-id="Listings__Loader"]');
    loader.contains('Loading job offerings ...');
  });
});

@assets
Feature: Insert an image into a page
  As a cms author
  I want to insert an image into a page
  So that I can insert them into my content efficiently

  Background:
    Given a "page" "About Us"
    And a "image" "folder1/file1.jpg"
    And a "image" "folder1/file2.jpg"
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/pages"
    And I click on "About Us" in the tree

  @assets
  Scenario: I can insert an image from the CMS file store
    Given I press the "Insert Media" HTML field button
    And I select the "folder" named "folder1" in the gallery
    And I click on the "image" named "file1" in the gallery
    Then I should see the "Form_FileInsertForm" form
    When I press the "Insert file" button
    Then the "Content" HTML field should contain "file1__Resampled.jpg"
    # Required to avoid "unsaved changed" browser dialog
    Then I press the "Save draft" button

  @assets
  Scenario: I can edit properties of an image before inserting it
    Given I press the "Insert Media" HTML field button
    And I select the "folder" named "folder1" in the gallery
    And I click on the "image" named "file1" in the gallery
    Then I should see the "Form_FileInsertForm" form
    And I fill in "Alternative text (alt)" with "My alt"
    And I press the "Insert file" button
    Then the "Content" HTML field should contain "file1__Resampled.jpg"
    And the "Content" HTML field should contain "My alt"
    # Required to avoid "unsaved changed" browser dialog
    Then I press the "Save draft" button

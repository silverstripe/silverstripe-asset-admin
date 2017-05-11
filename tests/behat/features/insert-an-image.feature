@assets @retry
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
    When I press the "Insert Media" HTML field button
    And I select the file named "folder1" in the gallery
    And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileInsertForm" form
    When I press the "Insert file" button
    Then the "Content" HTML field should contain "file1__Resampled.jpg"
    # Required to avoid "unsaved changed" browser dialog
      And I press the "Save draft" button

  @assets
  Scenario: I can edit properties of an image before inserting it
    When I press the "Insert Media" HTML field button
    And I select the file named "folder1" in the gallery
    And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileInsertForm" form
    When I fill in "Alternative text (alt)" with "My alt"
    And I press the "Insert file" button
    Then the "Content" HTML field should contain "file1__Resampled.jpg"
    And the "Content" HTML field should contain "My alt"
    # Required to avoid "unsaved changed" browser dialog
    And I press the "Save draft" button

  @assets
  Scenario: I can insert an image from a URL
    Given I press the "Insert Embedded content" HTML field button
    Then I wait for 2 seconds until I see the ".insert-embed-modal--create" element
    When I fill in "Url" with "http://www.silverstripe.org/themes/ssv3/img/ss_logo.png"
    And I press the "Add media" button
    Then I wait for 2 seconds until I see the ".insert-embed-modal--edit" element
    Then the "UrlPreview" field should contain "http://www.silverstripe.org/themes/ssv3/img/ss_logo.png"

    When I press the "Insert media" button
    Then the "Content" HTML field should contain "ss_logo.png"
    # Required to avoid "unsaved changed" browser dialog
    Then I press the "Save draft" button

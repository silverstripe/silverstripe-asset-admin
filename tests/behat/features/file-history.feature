@assets
Feature: View File History
  As a cms author
  I want to view the history of a file
  So that I can see who has made changes to a file

  Background:
    Given a "image" "folder1/file1.jpg"
    And a "image" "folder1/file2.jpg"
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/assets"
    And I select the "folder" named "folder1" in the gallery
    And I click on the "image" named "file1" in the gallery

  @javascript
  Scenario: I view the history of a file
    When I click the "History" tab
    Then I should see a history list
    And I click on the latest history item
    Then I should see the history form

  Scenario: Editing a file adds history
    And I click the "Details" tab
    And I fill in "Test 1" for "Form_FileEditForm_Title"
    And I press the "Save" button
    When I click the "History" tab
    Then the latest history item should contain "Renamed file to Test 1"

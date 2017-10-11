@assets @retry
Feature: View File History
  As a cms author
  I want to view the history of a file
  So that I can see who has made changes to a file

  Background:
    Given a "image" "folder1/file1.jpg"
      And a "image" "folder1/file2.jpg"
      And I am logged in with "ADMIN" permissions
      And I have a config file "history.yml"
      And I go to "/admin/assets"
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery

  @javascript
  Scenario: I view the history of a file
    When I click "History" in the "#Editor .nav-tabs" element
    Then I should see an ".history-list__list" element
    When I click on the latest history item
    Then I should see the "Form_fileHistoryForm" form

  Scenario: Editing a file adds history
    When I click "Details" in the "#Editor .nav-tabs" element
      And I fill in "Test 1" for "Form_fileEditForm_Title"
      And I press the "Save" button
      And I click "History" in the "#Editor .nav-tabs" element
    Then I should see "Updated title to Test 1" in the ".history-list__list" element

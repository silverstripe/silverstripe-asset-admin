@javascript @assets @retry
Feature: Upload file state
  As a cms author
  I want the file state to work correctly
  So that I feel confident in the file system

  Background:
    Given a "image" "file1.jpg"
    And a "image" "folder1/file2.jpg"
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/assets"

  Scenario: There are no ghost files when navigating folder after uploading a file
    When I click on the file named "folder1" in the gallery
    Then I should see the gallery item "file2" in position "1"
    When I attach the file "testfile.jpg" to dropzone "gallery-container"
    Then I should see the gallery item "testfile" in position "2"
    When I press the "Navigate up a level" button
    Then I should not see the file named "testfile" in the gallery
    Then I should see the gallery item "file1" in position "1"

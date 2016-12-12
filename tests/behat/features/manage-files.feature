@javascript @assets
Feature: Manage files
  As a cms author
  I want to upload and manage files within the CMS
  So that I can insert them into my content efficiently

  Background:
    Given a "image" "assets/folder1/file1.jpg" was created "2012-01-01 12:00:00"
      And a "image" "assets/folder1/folder1-1/file2.jpg" was created "2010-01-01 12:00:00"
      And a "folder" "assets/folder2"
      And I am logged in with "ADMIN" permissions
      And I go to "/admin/assets"

  @modal
  Scenario: I can add a new folder
    When I press the "Add folder" button
      And I type "newfolder" into the dialog
      And I confirm the dialog
    Then I should see the file named "newfolder" in the gallery

  Scenario: I can list files in a folder
    When I click on the file named "folder1" in the gallery
    Then I should see the file named "file1" in the gallery
      And I should see the file named "folder1-1" in the gallery
      And I should not see the file named "file2" in the gallery

  Scenario: I can upload a file to a folder
    When I click on the file named "folder1" in the gallery
      And I attach the file "testfile.jpg" to dropzone "gallery-container"
    Then I should see the file named "testfile" in the gallery

  Scenario: I can edit a file
    When I click on the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileEditForm" form
    When I fill in "renamedfile" for "Title"
      And I press the "Save" button
    Then I should see the file named "renamedfile" in the gallery
      And I should not see the file named "file1" in the gallery

  Scenario: I can delete a file
    When I click on the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileEditForm" form
    When I press the "Other actions" button
      And I press the "Delete" button, confirming the dialog
    Then I should not see the file named "file1" in the gallery

  Scenario: I can delete multiple files
    Given a "image" "assets/folder1/file2.jpg" was created "2012-01-02 12:00:00"
    When I click on the file named "folder1" in the gallery
      And I check the file named "file1" in the gallery
    Then I should see an ".bulk-actions__action[value='edit']" element
      And the ".bulk-actions-counter" element should contain "1"
    When I check the file named "file2" in the gallery
    Then the ".bulk-actions__action[value='delete']" element should contain "Delete"
      And the ".bulk-actions-counter" element should contain "2"
      And I should not see an ".bulk-actions__action[value='edit']" element
    When I attach the file "testfile.jpg" to dropzone "gallery-container"
      And I check the file named "testfile" in the gallery
    Then the ".bulk-actions-counter" element should contain "3"
      And I press the "Delete" button, confirming the dialog
      And I wait for 1 second
    Then I should not see the file named "file1" in the gallery
      And I should not see the file named "file2" in the gallery
      And I should not see the file named "testfile" in the gallery


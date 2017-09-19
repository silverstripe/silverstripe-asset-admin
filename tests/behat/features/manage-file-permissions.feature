@javascript @assets @retry
Feature: Manage file permissions
  As a cms author
  I want to set permissions on files
  So that I can prevent or allow users access

  Background:
    Given a "image" "assets/folder1/file1.jpg" was created "2012-01-01 12:00:00"
      And a "image" "assets/folder1/folder1-1/file2.jpg" was created "2010-01-01 12:00:00"
      And a "folder" "assets/folder2"
      And the "group" "EDITOR group" has permissions "Access to all CMS sections"
      And a page "Gallery" containing an image "assets/folder3/file1.jpg"
      And I am logged in with "ADMIN" permissions
      And I go to "/admin/assets"

  Scenario: I can limit edit permissions to admins
    When I check the folder named "folder1" in the gallery
    Then I should see an ".bulk-actions__action[value='edit']" element
      And the ".bulk-actions-counter" element should contain "1"
    When I press the "Edit" button
    Then I should see the "Form_fileEditForm" form
    When I click "Permissions" in the "#Editor .nav-tabs" element
      And I select "Only these groups (choose from list)" from "Who can edit this file?" input group
      And I select "ADMIN group" in the "#Form_fileEditForm_EditorGroups_Holder" tree dropdown
      And I press the "Save" button
      And I am not logged in
      And I am logged in with "EDITOR" permissions
      And I go to "/admin/assets"
      And I click on the folder named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileEditForm" form
      And the "Title" field has property "readonly"
      And I should not see the "Save" button
      And I should not see the "Publish" button

  Scenario: I can edit permissions if I am in the right group
    When I check the folder named "folder1" in the gallery
    Then I should see an ".bulk-actions__action[value='edit']" element
      And the ".bulk-actions-counter" element should contain "1"
    When I press the "Edit" button
    Then I should see the "Form_fileEditForm" form
    When I click "Permissions" in the "#Editor .nav-tabs" element
      And I select "Only these groups (choose from list)" from "Who can edit this file?" input group
      And I select "EDITOR group" in the "#Form_fileEditForm_EditorGroups_Holder" tree dropdown
      And I press the "Save" button
      And I am not logged in
      And I am logged in with "EDITOR" permissions
      And I go to "/admin/assets"
      And I wait for 1 second
      And I click on the folder named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileEditForm" form
      And the "Title" field does not have property "readonly"
      And I should see the "Save" button

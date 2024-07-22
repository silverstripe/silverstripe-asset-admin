@assets @retry @job3
Feature: Single file Upload field
  As a cms author
  I want to interact with the upload field to select a file

  Background:
    Given a "page" "About Us" has the "Content" "<p>My awesome content</p>"
      And a "image" "folder1/file1.jpg"
      And a "image" "folder1/file2.jpg"
      And a "folder" "folder1/folder1-1"
      And the "Company" "ACME inc" with "Category"="Other"
      And the "Employee" "Allen" with "Company"="1"
      And the "group" "EDITOR" has permissions "VIEW_DRAFT_CONTENT" and "Access to 'Files' section" and "FILE_EDIT_ALL" and "Access to 'Test ModelAdmin' section" and "TEST_DATAOBJECT_EDIT"
      And I am logged in as a member of "EDITOR" group
      And I go to "/admin/test/SilverStripe-FrameworkTest-Model-Employee"
      And I click "Allen" in the "#Form_EditForm_SilverStripe-FrameworkTest-Model-Employee" element
      And I should see an ".uploadfield" element

  Scenario: I can select an existing file
    When I click "Choose existing" in the ".uploadfield" element
      And I press the "Back" HTML field button
      And I select the file named "folder1" in the gallery
    When I click on the file named "file1" in the gallery
      Then I should see the "Form_fileSelectForm" form
    When I press the "Insert" button
      Then I should see "file1" in the ".uploadfield-item__title" element
    # Ensure you can remove the file then select a different one
    When I click on the ".uploadfield-item__remove-btn" element
      And I click "Choose existing" in the ".uploadfield" element
      And I click on the file named "file2" in the gallery
    When I press the "Insert" button
      Then I should see "file2" in the ".uploadfield-item__title" element
    # Required to avoid "unsaved changed" browser dialog
    Then I press the "Save" button

  Scenario: I can edit and select an existing file
    When I click "Choose existing" in the ".uploadfield" element
      And I press the "Back" HTML field button
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
      Then I should see the "Form_fileSelectForm" form
    When I press the "Details" button
      Then I should see the "Form_fileEditForm" form
      And I should see a "Insert" button
    When I fill in "Form_fileEditForm_Title" with "file one"
      And I click "Save" in the "#Form_fileEditForm" element
      Then I should see the "Form_fileSelectForm" form
      And I should see "File One" in the ".editor__heading" element
    When I press the "Insert" button
      Then I should see "File One" in the ".uploadfield-item__title" element
    # Required to avoid "unsaved changed" browser dialog
    Then I press the "Save" button

  Scenario: I can select files
    When I click "Choose existing" in the ".uploadfield" element
      And I press the "Back" HTML field button
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
      Then I should see the "Form_fileSelectForm" form
    When I press the "Insert" button
      Then I should see "file1" in the ".uploadfield-item__title" element
    When I click on the ".uploadfield-item__view-btn" element
      And I click on the file named "file2" in the gallery
      Then I should see the "Form_fileSelectForm" form
    When I press the "Insert" button
      Then I should see "file2" in the ".uploadfield-item__title" element
    # Required to avoid "unsaved changed" browser dialog
    Then I press the "Save" button

  Scenario: I can use modal breadcrumbs to navigate up levels
    When I click "Choose existing" in the ".uploadfield" element
      And I press the "Back" HTML field button
      And I select the file named "folder1" in the gallery
      And I select the file named "folder1-1" in the gallery
    Then I should see the breadcrumb link "Files"
      And I should see the breadcrumb link "folder1"
      And I should not see the breadcrumb link "folder1-1"
    When I click on the breadcrumb link "folder1"
      Then I should see the file named "folder1-1" in the gallery
      And I should not see the breadcrumb link "folder1"
      # Validate that we haven't navigated away from the pages admin
      And I should see an ".uploadfield" element
    When I click on the breadcrumb link "Files"
    Then I should see the file named "folder1" in the gallery
      And I should not see the breadcrumb link "Files"
      # Validate that we haven't navigated away from the pages admin
      And I should see an ".uploadfield" element

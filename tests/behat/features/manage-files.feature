@javascript @assets @retry
Feature: Manage files
  As a cms author
  I want to upload and manage files within the CMS
  So that I can insert them into my content efficiently

  Background:
    Given a "image" "assets/folder1/file1.jpg" was created "2012-01-01 12:00:00"
      And a "image" "assets/folder1/folder1-1/file2.jpg" was created "2010-01-01 12:00:00"
      And a "folder" "assets/folder2"
      And a page "Gallery" containing an image "assets/folder3/file1.jpg"
      And I am logged in with "ADMIN" permissions
      And I go to "/admin/assets"

  @modal
  Scenario: I can add a new folder
    When I press the "Add folder" button
    Then I should see the "Form_folderCreateForm" form
      And I fill in "Name" with "newfolder"
      And I press the "Create" button
    Then I should see the file named "newfolder" in the gallery
      And I should see the "Form_fileEditForm" form

  Scenario: I can list files in a folder
    When I click on the file named "folder1" in the gallery
    Then I should see the file named "file1" in the gallery
      And I should see the file named "folder1-1" in the gallery
      And I should not see the file named "file2" in the gallery

  Scenario: I can upload a file to a folder
    When I click on the file named "folder1" in the gallery
      And I attach the file "testfile.jpg" to dropzone "gallery-container"
    Then I should see the file named "testfile" in the gallery

  Scenario: I am blocked from uploading invalid files
    When I click on the file named "folder1" in the gallery
      And I attach the file "file.invalid" to dropzone "gallery-container"
    Then I should see an error message on the file "file"

  Scenario: I can edit a file
    When I click on the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileEditForm" form
    When I fill in "renamedfile" for "Title"
      And I press the "Save" button
    Then I should see the file named "renamedfile" in the gallery
      And I should not see the file named "file1" in the gallery

  Scenario: I can edit a folder
    When I check the folder named "folder1" in the gallery
    Then I should see an ".bulk-actions__action[value='edit']" element
      And the ".bulk-actions-counter" element should contain "1"
    When I press the "Edit" button
      And I wait for 1 second
    Then I should see the "Form_fileEditForm" form
    When I fill in "foldernew" for "Name"
      And I press the "Save" button
    Then I should see the file named "foldernew" in the gallery
      And I should not see the file named "folder1" in the gallery

  Scenario: I can publish a file and unpublish a file
    When I click on the folder named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileEditForm" form
      And I should see the file status flag
    When I press the "Publish" button
    Then I should see the "Form_fileEditForm" form
      And I should not see the file status flag
    When I press the "Other actions" button
      And I press the "Unpublish" button, confirming the dialog
    Then I should see the "Form_fileEditForm" form
      And I should see the file status flag

  Scenario: I can delete a file
    When I click on the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileEditForm" form
    When I press the "Other actions" button
      And I press the "Delete" button
    Then I should see a modal titled "Confirm file deletion"
      And I press the Delete button inside the modal
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
      And I press the "Delete" button
    Then I should see a modal titled "Confirm file deletion"
      And I press the Delete button inside the modal
    Then I should not see the file named "file1" in the gallery
      And I should not see the file named "file2" in the gallery
      And I should not see the file named "testfile" in the gallery
      And I should see a "3 folders/files were successfully archived" success toast

  Scenario: I can move multiple files
    Given a "image" "assets/folder1/file2.jpg" was created "2012-01-02 12:00:00"
      And a "folder" "assets/folder1/folder3"
    When I click on the file named "folder1" in the gallery
      And I check the file named "file1" in the gallery
      And I check the file named "file2" in the gallery
    Then I should see an ".bulk-actions__action[value='move']" element
      And the ".bulk-actions-counter" element should contain "2"
      And the ".bulk-actions__action[value='move']" element should contain "Move"
    When I attach the file "testfile.jpg" to dropzone "gallery-container"
      And I check the file named "testfile" in the gallery
    Then the ".bulk-actions-counter" element should contain "3"
      And I press the "Move" button
    Then I should see a modal titled "Move 3 item(s) to..."
      And I should see the "Form_moveForm" form
    When I select "folder2/" in the "#Form_moveForm_FolderID_Holder" tree dropdown
      And I click "Move" in the "#Form_moveForm_action_move" element
    Then I should not see the file named "file1" in the gallery
      And I should not see the file named "file2" in the gallery
      And I should not see the file named "testfile" in the gallery
      And I should see a "Moved 3 item(s) to folder2/" success toast with these actions: Go to folder
    When I click the "Go to folder" toast action
    Then I should see the file named "file1" in the gallery
      And I should see the file named "file2" in the gallery
      And I should see the file named "testfile" in the gallery

  Scenario: I can publish and unpublish multiple files
    Given a "image" "assets/folder1/file2.jpg" was created "2012-01-02 12:00:00"
      And a "image" "assets/folder1/testfile.jpg"
      And a "folder" "assets/folder1/folder2"
    When I click on the file named "folder1" in the gallery
      And I check the file named "file2" in the gallery
      And I check the file named "testfile" in the gallery
      And I check the folder named "folder2" in the gallery
    Then I should not see an "#BulkActions" element
      And I should not see an ".bulk-actions__action[value='publish']" element
      And I should not see an ".bulk-actions__action[value='unpublish']" element
    When I check the folder named "folder2" in the gallery
      And I press the "View actions" button
    Then I should see an ".bulk-actions__action[value='publish']" element
      And I should not see an ".bulk-actions__action[value='unpublish']" element
    When I click "Publish" in the "#BulkActions .dropdown-menu" element
      Then I should see a "2 folders/files were successfully published" success toast
    When I check the file named "file2" in the gallery
      And I check the file named "testfile" in the gallery
      And I press the "View actions" button
    Then I should not see an ".bulk-actions__action[value='publish']" element
      And I should see an ".bulk-actions__action[value='unpublish']" element
    When I check the file named "testfile" in the gallery
      And I press the "View actions" button
      And I press the "Unpublish" button
      Then I should see a "1 folders/files were successfully unpublished" success toast
    When I check the file named "file2" in the gallery
      And I check the file named "testfile" in the gallery
      And I press the "View actions" button
    Then I should see an ".bulk-actions__action[value='publish']" element
      And I should see an ".bulk-actions__action[value='unpublish']" element
    When I click on the file named "file2" in the gallery
      Then I should see an ".font-icon-rocket[name='action_publish']" element
    When I press the "View actions" button
      And I click "Publish" in the "#BulkActions .dropdown-menu" element
    Then I should not see an ".font-icon-rocket[name='action_publish']" element
      And I should see an ".font-icon-tick[name='action_publish']" element


  @modal
  Scenario: I can delete a folder containing a file that is in use with a warning
    When I check the file named "folder3" in the gallery
    Then I press the "Delete" button
    Then I should see a modal titled "Confirm file deletion"
      And I should see "This folder contains file(s) that are currently used" in the ".modal-body" region
      And I should see "Ensure files are removed from content areas" in the ".modal-body" region
      And I press the Delete button inside the modal
    Then I should see a "1 folders/files were successfully archived" success toast
      And I should not see the file named "folder3" in the gallery

  @modal
  Scenario: I can delete a file that is in use with a warning
    When I click on the file named "folder3" in the gallery
      And I check the file named "file1" in the gallery
    Then I press the "Delete" button
    Then I should see a modal titled "Confirm file deletion"
      And I should see "file is currently in use" in the ".modal-body" region
      And I press the Delete button inside the modal
    Then I should see a "1 folders/files were successfully archived" success toast
      And I should not see the file named "file1" in the gallery

  Scenario: I can move a file through editing
    When I click on the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileEditForm" form
    When I select "(Top level)" in the "#Form_fileEditForm_ParentID_Holder" tree dropdown
      And I press the "Save" button
    Then I should see the file named "file1" in the gallery
      And I should see the file named "folder1" in the gallery
      And I should not see "File cannot be found" in the "#Form_fileEditForm" element
    # test moving again to see if Tuple has updated value
    When I select "folder2" in the "#Form_fileEditForm_ParentID_Holder" tree dropdown
      And I press the "Save" button
    Then I should see the file named "file1" in the gallery
      And I should not see the file named "folder2" in the gallery
      And I should not see "File cannot be found" in the "#Form_fileEditForm" element

  Scenario: I can search files
    When I press the "Show search" button
      Then I should see an "#AssetSearchForm_searchbox" element
    Then I fill in "SearchBox__name" with "file1"
      And I press the "Enter" key in the "SearchBox__name" field
    Then I should see the file named "file1" in the gallery
      And I should not see the file named "folder1" in the gallery
    When I press the "Advanced" button
      Then I should see an ".search-form" element
    Then I select "Archive" from "File type"
      And I press the "Search" button
      Then I should see "No items found"
      And I should see "File type: Archive"
    Then I press the "Close" button
      And I should not see an "#AssetSearchForm_searchbox" element
      And I should see the file named "folder1" in the gallery

@assets @retry @job3
Feature: Replace a file with a new file
  As a cms author
  I want to upload a new file that will replace an existing file

  Background:
    Given a "image" "folder1/file1.jpg"
    And a "file" "folder1/document.pdf"
    And a "image" "folder1/file2.jpg"
    And the "group" "EDITOR" has permissions "Access to 'Files' section" and "FILE_EDIT_ALL"
    And I am logged in as a member of "EDITOR" group
    And I go to "/admin/assets"
    And I select the file named "folder1" in the gallery
    And I click on the file named "file1" in the gallery
    And I wait for 5 second
    Then I should see an "#Form_fileEditForm" element

  @javascript
  Scenario: I upload a new file into the file I have open
    When I attach the file "testfile.jpg" to dropzone "PreviewImage"
    Then I should see a ".preview-image-field__message-button" element
      And I should see a ".preview-image-field__message--success" element
      And the "Name" field should contain "file1.jpg"
    When I press the "Save" button
    Then I should not see a ".preview-image-field__message--success" element
      And I should not see a ".preview-image-field__message-button" element
    When I press the "Other actions" button
      Then I should see a "Replace file" button

  @javascript
  Scenario: Replacing a file with the same file detects and avoids duplication
    When I attach the file "file1.jpg" to dropzone "PreviewImage"
    Then I should see a ".preview-image-field__message-button" element
      And I should see a ".preview-image-field__message--success" element
      And the "Name" field should contain "file1.jpg"
    When I press the "Save" button
    Then the "Name" field should contain "file1.jpg"
      And I should not see a ".preview-image-field__message--success" element
      And I should not see a ".preview-image-field__message-button" element

  @javascript @modal
  Scenario: I upload a pdf file to replace an image file
    When I attach the file "document.pdf" to dropzone "PreviewImage"
      And I confirm the dialog
    Then I should see a ".preview-image-field__message--success" element
      And the "Name" field should contain "document-v2.pdf"
    When I press the "Save" button
    Then the "Name" field should contain "document-v2.pdf"
      And I should not see a ".preview-image-field__message--success" element

  @javascript
  Scenario: I upload an image file exceeding maximum file size to replace a file
    Given the maximum file size is "5k"
      And I go to "/admin/assets"
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    When I attach the file "file1.jpg" to dropzone "PreviewImage"
    Then I should see a ".preview-image-field__message-button" element
      And I should see a ".preview-image-field__message--success" element
      And the "Name" field should contain "file1.jpg"
    When I attach the file "file3.jpg" to dropzone "PreviewImage"
      And I wait for 5 second
    Then I should see a ".preview-image-field__message--error" element
      And I should see "Filesize is too large, maximum 5 KB allowed" in the ".preview-image-field__message--error" element
      And the "Name" field should contain "file1.jpg"

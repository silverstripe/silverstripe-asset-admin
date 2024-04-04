@assets @retry
Feature: Use the WYSIWYG image toolbar
  As a cms author
  I want to edit and delete images using the context toolbar
  So that I can administer my content efficiently

  Background:
    Given a "page" "About Us" has the "Content" "<p>My awesome content</p>"
      And an "image" "folder1/file1.jpg"
      And the "group" "EDITOR" has permissions "Access to 'Files' section" and "Access to 'Pages' section" and "FILE_EDIT_ALL"
      And I am logged in as a member of "EDITOR" group
      And I go to "/admin/pages"
      And I click on "About Us" in the tree
      And I press the "Insert from Files" HTML field button
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
      And I press the "Insert file" button
      # Required to avoid "unsaved changes" browser dialog
      And I press the "Save" button
    # Validate that everything is ready for the test scenarios
    Then I should not see a ".tox-pop__dialog .tox-toolbar" element
      And I should not see the "Form_fileInsertForm" form
      And the "Content" HTML field should contain "file1.jpg"

  Scenario: I can open the image edit modal from the context toolbar
    When I select the image "file1.jpg" in the "Content" HTML field
    Then I should see a ".tox-pop__dialog .tox-toolbar button[title='Edit image']" element
    When I press the "Edit image" button
    Then I should see the "Form_fileInsertForm" form

  Scenario: I can delete the image from the context toolbar
    When I select the image "file1.jpg" in the "Content" HTML field
    Then I should see a ".tox-pop__dialog .tox-toolbar button[title='Delete image']" element
    When I press the "Delete image" button
    Then the "Content" HTML field should not contain "file1.jpg"
    # Required to avoid "unsaved changes" browser dialog
    When I press the "Save" button

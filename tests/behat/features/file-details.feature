Feature: File details
  As a cms author
  I want to see file details
  So that I can do file things

  Background:
    Given the "group" "EDITOR" has permissions "Access to 'Files' section" and "FILE_EDIT_ALL"
    And a "image" "assets/file1.jpg"
    And a "folder" "assets/folder1"
    And a "page" "My page" has the "Content" "<p>[image id=1]</p>"
    And I am logged in as a member of "EDITOR" group
    And I go to "/admin/assets"

  Scenario: Operate file details
    When I click on the file named "file1" in the gallery

    # Used on table
    And I click "Used on" in the "#Editor .nav-tabs" element
    And I wait for 5 seconds
    Then I should see "My page"

    # Draft / modified status flags
    When I click "Details" in the "#Editor .nav-tabs" element
    Then the rendered HTML should contain "<span class="editor__status-flag">Draft</span>"
    When I press the "Publish" button
    And I wait for 5 seconds
    Then the rendered HTML should not contain "<span class="editor__status-flag">"
    And I fill in "Form_fileEditForm_Title" with "file-modified-1"
    And I press the "Save" button
    And I wait for 5 seconds
    Then the rendered HTML should contain "<span class="editor__status-flag">Modified</span>"

  @modal
  Scenario: Navigate within react context with unsaved changes
    When I click on the file named "file1" in the gallery
    And I wait for 1 second
    Then I should see the "Form_fileEditForm" form
    When I fill in "renamedfile" for "Title"
    And I click on the file named "folder1" in the gallery
    Then I see the text "Are you sure you want to navigate away from this page?" in the alert
    When I dismiss the dialog
    Then I should see the file named "file1" in the gallery

    When I click on the file named "folder1" in the gallery
    Then I see the text "Are you sure you want to navigate away from this page?" in the alert
    When I confirm the dialog
    Then I should not see the file named "file1" in the gallery
    # bug - the form is still marked dirty so we have to open the form again to stop unexpected alerts
    # see https://github.com/silverstripe/silverstripe-asset-admin/issues/1334
    # Once that is resolved, the rest of the steps in this scenario should be removed.
    When I click on the breadcrumb link "Files"
    And I confirm the dialog
    And I click on the file named "file1" in the gallery
    And I confirm the dialog

  @modal
  Scenario: Navigate outside react context with unsaved changes
    When I click on the file named "file1" in the gallery
    And I wait for 1 second
    Then I should see the "Form_fileEditForm" form
    When I fill in "renamedfile" for "Title"
    And I go to "/"
    # Note that the text for this dialog is defined by the browser, so we shouldn't add an assertion for that here
    When I dismiss the dialog
    Then I should see the file named "file1" in the gallery

    When I go to "/"
    When I confirm the dialog
    Then I should not see the file named "file1" in the gallery

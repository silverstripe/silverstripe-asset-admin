Feature: File details
  As a cms author
  I want to see file details
  So that I can do file things

  Background:

    Given the "group" "EDITOR group" has permissions "CMS_ACCESS_LeftAndMain" and "FILE_EDIT_ALL"
    And a "image" "assets/file1.jpg"
    And a "page" "My page" has the "Content" "<p>[image id=1]</p>"
    And I am logged in with "EDITOR" permissions

  Scenario: Operate file details

    When I go to "/admin/assets"
    When I click on the file named "file1" in the gallery

    # Used on table
    When I click "Used on" in the "#Editor .nav-tabs" element
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

@retry @job1
Feature: File details
  As a cms author
  I want to see file details
  So that I can do file things

  Background:
    Given I add an extension "SilverStripe\AssetAdmin\Tests\Behat\Context\Extensions\DefaultFolderExtension" to the "SilverStripe\FrameworkTest\Model\Company" class without dev-build
    # Config will put ~2 second delay until the unsaved changes notice shows
    And I have a config file "unsaved-changes-indicator-asset-admin.yml"
    And a "image" "assets/file1.jpg"
    And a "folder" "assets/folder1"
    And a "page" "My page" has the "Content" "<p>[image id=1]</p>"
    And a "company" "ACME inc"
    And the "group" "EDITOR" has permissions "VIEW_DRAFT_CONTENT" and "Access to 'Test ModelAdmin' section" and "TEST_DATAOBJECT_EDIT" and "Access to 'Files' section" and "FILE_EDIT_ALL"
    And I am logged in as a member of "EDITOR" group
    And I go to "/admin/assets"

  Scenario: Operate file details
    When I click on the file named "file1" in the gallery

    # Unsaved change indicator
    Then I should not see the ".unsaved-changes-indicator" element
    When I fill in "Title" with "Hello"
    Then I should not see the ".unsaved-changes-indicator" element
    When I wait for 3 seconds
    Then I should see the ".unsaved-changes-indicator" element
    When I fill in "Title" with "file1"
    Then I should not see the ".unsaved-changes-indicator" element

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
    And I wait for 2 seconds
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

  Scenario: Save file details from different folder
    And I go to "/admin/test/"
    And I click "ACME inc" in the "#Form_EditForm_SilverStripe-FrameworkTest-Model-Company" element
    And I click "Choose existing" in the ".uploadfield" element
    Then I should see "test-folder" in the ".breadcrumb__item--last .breadcrumb__item-title" element
    When I press the "Back" HTML field button
    And I select the file named "file1" in the gallery
    And I press the "Insert" button
    And I press the "Save" button
    Then I should see a "Saved Company "ACME inc" successfully" success toast
    # Now open the modal again - file1 is selected but not displayed in the gallery view on the left
    When I press the "View" button
    Then I should see "test-folder" in the ".breadcrumb__item--last .breadcrumb__item-title" element
    And I should not see the file named "file1" in the gallery
    And I should see "file1" in the "#Form_fileSelectForm_TitleHeader" element
    When I press the "Details" button
    And I fill in "Title" with "my file"
    And I press the "Save" button
    # After saving, we're brought to the folder containing the selected file, which has been updated
    Then I should see "Files" in the ".breadcrumb__item--last .breadcrumb__item-title" element
    And I should see the file named "my file" in the gallery


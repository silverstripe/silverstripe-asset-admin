@assets @retry
Feature: Insert an image into a page
  As a cms author
  I want to insert an image into a page
  So that I can insert them into my content efficiently

  Background:
    Given a "page" "About Us" has the "Content" "<p>My awesome content</p>"
      And a "image" "folder1/file1.jpg"
      And a "image" "folder1/file2.jpg"
      And I am logged in with "ADMIN" permissions
      And I go to "/admin/pages"
      And I click on "About Us" in the tree

  @assets
  Scenario: I can insert an image from the CMS file store
    When I press the "Insert from Files" HTML field button
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileInsertForm" form
    When I press the "Insert file" button
    Then the "Content" HTML field should contain "file1.jpg"
    # Required to avoid "unsaved changed" browser dialog
      And I press the "Save draft" button

  @assets
  Scenario: I can edit properties of an image before inserting it
    When I press the "Insert from Files" HTML field button
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileInsertForm" form
    When I fill in "Alternative text (alt)" with "My alt"
      And I press the "Insert file" button
    Then the "Content" HTML field should contain "file1.jpg"
      And the "Content" HTML field should contain "My alt"
      # Required to avoid "unsaved changed" browser dialog
      And I press the "Save draft" button

  @assets
  Scenario: I can insert an image from a URL
    Given I press the "Insert media via URL" HTML field button
      And I wait for 2 seconds until I see the ".insert-embed-modal--create" element
    When I fill in "Url" with "http://www.silverstripe.org/themes/ssv3/img/ss_logo.png"
      And I press the "Add media" button
      And I wait for 2 seconds until I see the ".insert-embed-modal--edit" element
    Then the "UrlPreview" field should contain "http://www.silverstripe.org/themes/ssv3/img/ss_logo.png"

    When I press the "Insert media" button
    Then the "Content" HTML field should contain "ss_logo.png"
    # Required to avoid "unsaved changed" browser dialog
      And I press the "Save draft" button

  Scenario: I can link to a file
    Given I select "awesome" in the "Content" HTML field
    When I press the "Insert Link" HTML field button
      And I click "Link to a file" in the ".mce-menu" element
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see an "form#Form_fileInsertForm" element
      And I fill in "Description" with "My file"
      And I press the "Insert file" button
    Then the "Content" HTML field should contain "<a title="My file" href="[file_link,id=2]">awesome</a>"
    # Required to avoid "unsaved changes" browser dialog
      And I press the "Save draft" button
    # Check that the field is reset when adding another new link
    When I select "awesome" in the "Content" HTML field
      And I press the "Insert Link" HTML field button
      And I click "Link to a file" in the ".mce-menu" element
    Then I should see an "form#Form_fileInsertForm" element
      And the "Description" field should contain "My file"
      And I should see "Update file" in the "button[name=action_insert]" element

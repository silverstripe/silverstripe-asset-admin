@assets @retry @in-modal
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

  Scenario: I can insert an image from the CMS file store
    When I press the "Insert from Files" HTML field button
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileInsertForm" form
      And I should not see an ".gallery-item--selectable" element
      And I should not see an ".bulk-actions" element
    When I press the "Insert" button
    Then the "Content" HTML field should contain "file1.jpg"
    # Required to avoid "unsaved changed" browser dialog
      And I press the "Save" button

  Scenario: I can edit properties of an image before inserting it
    When I press the "Insert from Files" HTML field button
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileInsertForm" form
    When I fill in "Alternative text (alt)" with "My alt"
      And I press the "Insert" button
    Then the "Content" HTML field should contain "file1.jpg"
      And the "Content" HTML field should contain "My alt"
      # Required to avoid "unsaved changed" browser dialog
      And I press the "Save" button

  Scenario: I can edit image in the file modal
    When I press the "Insert from Files" HTML field button
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
      Then I should see the "Form_fileInsertForm" form
      And I should see the "Insert file" button
    When I fill in "Alternative text (alt)" with "My alt"
      # Filling in width is purely to get the framework to scroll-up so that the details button is in view
      And I scroll the editor details panel to the top
      And I press the "Details" button
      Then I should see the "Form_fileEditForm" form
      And I should not see an ".gallery-item--selectable" element
      And I should not see an ".bulk-actions" element
    When I fill in "Form_fileEditForm_Title" with "file one"
      And I press the "Save" button
      Then I should see the "Form_fileInsertForm" form
      And I should see the "Insert file" button
      And I should see "File One" in the ".editor__heading" element
    When I press the "Details" button
      Then I should see the "Form_fileEditForm" form
    When I click on the ".editor-header__back-button" element
      Then I should see the "Form_fileInsertForm" form
    When I press the "Insert file" button
      Then the "Content" HTML field should contain "file1.jpg"
      And the "Content" HTML field should contain "My alt"
      # Required so that we click the correct save button below
      And I press the "Save" button
    When I select the image "file1.jpg" in the "Content" HTML field
      And I press the "Insert from Files" HTML field button
      Then I should see the "Update file" button
      # Assert redux override functionality
      Then I should see an "#Form_fileInsertForm_AltText[value='My alt']" element
    When I press the "Details" button
      And I fill in "Form_fileEditForm_Title" with "file one updated"
      And I press the "Save" button
      Then I should see the "Update file" button
    When I fill in "Alternative text (alt)" with "My alt updated"
      And I press the "Update file" button
      Then the "Content" HTML field should contain "My alt updated"
      # Required to avoid "unsaved changed" browser dialog
      And I press the "Save" button

  Scenario: I can link to a file
    Given I select "awesome" in the "Content" HTML field
    When I press the "Insert link" HTML field button
      And I click "Link to a file" in the ".mce-menu" element
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileInsertForm" form
      And I fill in "Description" with "My file"
      And I press the "Link to file" button
    Then the "Content" HTML field should contain "<a title="My file" href="[file_link,id=2]">awesome</a>"
    # Required to avoid "unsaved changes" browser dialog
      And I press the "Save" button
    # Check that the field is reset when adding another new link
    When I select "awesome" in the "Content" HTML field
      And I press the "Insert link" HTML field button
      And I click "Link to a file" in the ".mce-menu" element
    Then I should see the "Form_fileInsertForm" form
      And the "Description" field should contain "My file"
      And I should see "Link to file" in the "button[name=action_insert]" element

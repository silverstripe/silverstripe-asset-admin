@assets @retry @in-modal
Feature: Insert an image into a page
  As a cms author
  I want to insert an image into a page
  So that I can insert them into my content efficiently

  Background:
    Given a "page" "About Us" has the "Content" "<p>My awesome content</p>"
      And a "image" "folder1/file1.jpg"
      And a "image" "folder1/file2.jpg"
      And a "folder" "folder1/folder1-1"
      And the "group" "EDITOR" has permissions "Access to 'Files' section" and "Access to 'Pages' section" and "FILE_EDIT_ALL"
      And I am logged in as a member of "EDITOR" group
      And I go to "/admin/pages"
      And I click on "About Us" in the tree

  Scenario: I can insert an image from the CMS file store
    When I press the "Insert from Files" HTML field button
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileInsertForm" form
      And I should not see an ".gallery-item--selectable" element
      And I should not see an ".bulk-actions" element
    When I press the "Insert file" button
    Then the "Content" HTML field should contain "file1.jpg"
    # Required to avoid "unsaved changed" browser dialog
      And I press the "Save" button

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
      And I press the "Save" button

  Scenario: I can use modal breadcrumbs to navigate up levels
    When I press the "Insert from Files" HTML field button
      And I select the file named "folder1" in the gallery
      And I select the file named "folder1-1" in the gallery
    Then I should see the breadcrumb link "Files"
      And I should see the breadcrumb link "folder1"
      And I should not see the breadcrumb link "folder1-1"
    When I click on the breadcrumb link "folder1"
      Then I should see the file named "folder1-1" in the gallery
      And I should not see the breadcrumb link "folder1"
      # Validate that we haven't navigated away from the pages admin
      And I can see the preview panel
    When I click on the breadcrumb link "Files"
    Then I should see the file named "folder1" in the gallery
      And I should not see the breadcrumb link "Files"
      # Validate that we haven't navigated away from the pages admin
      And I can see the preview panel

  Scenario: I can edit an image in the file modal
    When I press the "Insert from Files" HTML field button
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
      Then I should see the "Form_fileInsertForm" form
      And I should see the "Insert file" button
      # blank string is the value for "Lazy (default)" - note despite the word 'contain' it means 'equals'
      Then the "Loading" field should contain ""
    When I fill in "Alternative text (alt)" with "My alt"
      Then I select "eager" from the "Loading" field
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
      And the "Loading" field should contain "eager"
    When I press the "Insert file" button
      Then the "Content" HTML field should contain "file1.jpg"
      And the "Content" HTML field should contain "My alt"
      # This is reading the shortcode in the textarea which is saved to the DB
      # ie. not the html generated for tinymce
      And the "Content" HTML field should contain "loading="eager""
      # Required so that we click the correct save button below
      And I press the "Save" button
    When I select the image "file1.jpg" in the "Content" HTML field
      And I press the "Insert from Files" HTML field button
      Then I should see the "Update file" button
      # Assert redux override functionality
      Then the "AltText" field should contain "My alt"
      And the "Loading" field should contain "eager"
    When I press the "Details" button
      And I fill in "Form_fileEditForm_Title" with "file one updated"
      And I press the "Save" button
      Then I should see the "Update file" button
    When I fill in "Alternative text (alt)" with "My alt updated"
      And I press the "Update file" button
      Then the "Content" HTML field should contain "My alt updated"
      # Required to avoid "unsaved changed" browser dialog
      And I press the "Save" button

  Scenario: I can add text with special characters as Alternative text
    When I press the "Insert from Files" HTML field button
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileInsertForm" form
    When I fill in "Alternative text (alt)" with "My alt updated & saved"
    When I fill in "Title text (tooltip)" with "My title text updated & saved"
      And I press the "Insert file" button
    Then the "Content" HTML field should contain "file1.jpg"
      And the "Content" HTML field should contain "My alt updated &amp; saved"
      And I press the "Save" button
    # We need this to update DB with new value after it was created in the previous step
    When I press the "Save" button
      Then the "Content" HTML field should contain "file1.jpg"
      And the "Content" HTML field should contain "My alt updated & saved"
      And the "Content" HTML field should contain "My title text updated & saved"
    When I select the image "file1.jpg" in the "Content" HTML field
      And I press the "Insert from Files" HTML field button
      And I should see the "Update file" button
    When I fill in "Caption" with "My caption updated & saved"
      And I press the "Update file" button
    Then the "Content" HTML field should contain "My alt updated &amp; saved"
      And the "Content" HTML field should contain "My title text updated &amp; saved"
      And the "Content" HTML field should contain "My caption updated &amp; saved"
      And I press the "Publish" button
    Then I go to "/about-us"
      And I should see an "img[alt='My alt updated & saved']" element
      And I should see an "img[title='My title text updated & saved']" element
      And I should see "My caption updated & saved"

  Scenario: I can link to a file
    Given I select "awesome" in the "Content" HTML field
    When I press the "Insert link" HTML field button
      And I click "Link to a file" in the ".tox-collection__group" element
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
      And I click "Link to a file" in the ".tox-collection__group" element
    Then I should see the "Form_fileInsertForm" form
      And the "Description" field should contain "My file"
      And I should see "Link to file" in the "button[name=action_insert]" element

  Scenario: I can link to a file with link text
    Given I fill in the "Content" HTML field with "<p><img src='file1.jpg'></p>"
    When I press the "Insert link" HTML field button
      And I click "Link to a file" in the ".mce-menu" element
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileInsertForm" form
      And I press the "Link to file" button
    Then I should see "Link text is required"
      And I fill in "Link text" with "My file"
      And I press the "Link to file" button
    Then the "Content" HTML field should contain "<a href="[file_link,id=2]">My file</a>"
      And I press the "Save" button

  Scenario: I can wrap an image in a link to a file
    # Add an actual image to the WYSIWYG
    Given I press the "Insert from Files" HTML field button
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
      And I press the "Insert file" button
      # Required to avoid "unsaved changes" browser dialog
      And I press the "Save" button
    # Validate that everything is ready for the test
    Then I should not see a ".tox-pop__dialog .tox-toolbar" element
      And I should not see the "Form_fileInsertForm" form
      And the "Content" HTML field should contain "file1.jpg"
    When I select the image "file1.jpg" in the "Content" HTML field
      And I press the "Insert link" HTML field button
      And I click "Link to a file" in the ".tox-collection__group" element
      And I select the file named "folder1" in the gallery
      And I click on the file named "file1" in the gallery
    Then I should see the "Form_fileInsertForm" form
      And I should not see "Link text"
      And I press the "Link to file" button
    Then the "Content" HTML field should contain "<a href="[file_link,id=2]">[image src="/assets/folder1/3d0ef6ec37/file1.jpg" id="2" width="50" height="50" class="leftAlone ss-htmleditorfield-file image"]</a>"
      # Required to avoid "unsaved changed" browser dialog
      And I press the "Save" button

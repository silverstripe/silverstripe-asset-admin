@retry @job3
Feature: Accessibility asset-admin
  As a user with accessibility needs
  I want to be able to use asset-admin with accessibile technology

  Background:
    Given a "image" "folder1/file1.jpg" has "Filename"="folder1/file1.jpg" and "Title"="file001" and "LastEdited"="2025-01-01 00:00:00"
      And a "image" "folder1/file2.jpg" has "Filename"="folder1/file2.jpg" and "Title"="file002" and "LastEdited"="2026-12-12 00:00:00"
      And a "folder" "folder2"
      And the "group" "EDITOR" has permissions "Access to 'Files' section" and "FILE_EDIT_ALL"
      And I am logged in as a member of "EDITOR" group
      And I go to "/admin/assets"
      And I click on the file named "folder1" in the gallery

  Scenario: Tab navigation on react edit form using arrow keys loads focused tab
    # Note - other react edit forms e.g. linkfield will use the same tab nav code
    # so only testing this here
    And I click on the file named "file001" in the gallery
    Then I should see the "Form_fileEditForm" form
    When I click on the "#Form_fileEditForm_Title" element
    And I press the "Shift-Tab" key globally
    Then the ".nav-tabs .nav-item:nth-of-type(1) .nav-link" element should have focus
    And I should see "Filename"
    And I should not see "Who can view this file?"
    When I press the "Right" key globally
    Then the ".nav-tabs .nav-item:nth-of-type(2) .nav-link" element should have focus
    And I should not see "Filename"
    And I should see "Who can view this file?"
    When I press the "Left" key globally
    Then the ".nav-tabs .nav-item:nth-of-type(1) .nav-link" element should have focus
    And I should see "Filename"
    And I should not see "Who can view this file?"
    When I press the "Tab" key globally
    Then the "#Form_fileEditForm_Title" element should have focus

  Scenario: I can sort the table view using the keyboard
    Given I press the "table" button
      And I wait until I see the ".gallery__table" element
      # Move focus to the element before the table so we have a known starting point
      And I focus on the "#button-view-tile" element
    When I should see the gallery item "file001" in position "1"
      And I should see the gallery item "file002" in position "2"
      And the ".gallery__table-column--title" element "aria-sort" attribute should be "ascending"
      And the ".gallery__table-column--modified" element "aria-sort" attribute should be ""
    When I press the "Tab" key globally
    Then the ".gallery__table-column--title button.gallery__table-column__sort-button" element should have focus
    When I press the "Enter" key globally
    Then I should see the gallery item "file001" in position "2"
      And I should see the gallery item "file002" in position "1"
      And the ".gallery__table-column--title" element "aria-sort" attribute should be "descending"
      And the ".gallery__table-column--title button.gallery__table-column__sort-button" element should have focus
    When I press the "Tab" key globally
    Then the ".gallery__table-column--modified button.gallery__table-column__sort-button" element should have focus
    When I press the "Enter" key globally
    Then I should see the gallery item "file001" in position "1"
      And I should see the gallery item "file002" in position "2"
      And the ".gallery__table-column--modified" element "aria-sort" attribute should be "ascending"
      And the ".gallery__table-column--title" element "aria-sort" attribute should be ""
      And the ".gallery__table-column--modified button.gallery__table-column__sort-button" element should have focus
    When I press the "Enter" key globally
    Then I should see the gallery item "file001" in position "2"
      And I should see the gallery item "file002" in position "1"
      And the ".gallery__table-column--modified" element "aria-sort" attribute should be "descending"
      And the ".gallery__table-column--title" element "aria-sort" attribute should be ""
      And the ".gallery__table-column--modified button.gallery__table-column__sort-button" element should have focus

  Scenario: I can edit a file WITHOUT using the actions panel in table view using the keyboard
    Given I press the "table" button
      And I wait until I see the ".gallery__table" element
      # Move focus to the element before the table so we have a known starting point
      And I focus on the "#button-view-tile" element
    Given I press the "Tab" key globally
      And I press the "Tab" key globally
      And I press the "Tab" key globally
      And I press the "Tab" key globally
    Then the "#row-0-thumbnail button.gallery__table-image__btn" element should have focus
    When I press the "Enter" key globally
    Then I should see the "Form_fileEditForm" form
      And the "input[name='Title']" element "value" attribute should be "file001"

  Scenario: I can edit a file using the actions panel in table view using the keyboard
    Given I press the "table" button
      And I wait until I see the ".gallery__table" element
      # Move focus to the element before the table so we have a known starting point
      And I focus on the "#button-view-tile" element
    Given I press the "Tab" key globally
      And I press the "Tab" key globally
      And I press the "Tab" key globally
    Then the "#row-0 input[type='checkbox']" element should have focus
      And the file named "file001" in the gallery should not be checked
      And the file named "file002" in the gallery should not be checked
      And I should not see the ".bulk-actions-counter" element
    # Check the box
    When I press the "Space" key globally
    Then the "#row-0 input[type='checkbox']" element should have focus
      And the file named "file001" in the gallery should be checked
      And the file named "file002" in the gallery should not be checked
      And the ".bulk-actions-counter" element should contain "1 selected"
    # Uncheck the box
    When I press the "Space" key globally
    Then the "#row-0 input[type='checkbox']" element should have focus
      And the file named "file001" in the gallery should not be checked
      And the file named "file002" in the gallery should not be checked
      And I should not see the ".bulk-actions-counter" element
    # Check the other box
    When I press the "Tab" key globally
      And I press the "Tab" key globally
      And I press the "Space" key globally
    Then the "#row-1 input[type='checkbox']" element should have focus
      And the file named "file001" in the gallery should not be checked
      And the file named "file002" in the gallery should be checked
      And the ".bulk-actions-counter" element should contain "1 selected"
    # Move focus to the actions box, which is currently BEFORE the table in the tab order
    When I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
    Then the "button.bulk-actions__action[value='edit']" element should have focus
    When I press the "Enter" key globally
    Then I should see the "Form_fileEditForm" form
      And the "input[name='Title']" element "value" attribute should be "file002"

  Scenario: I can move files in table view using the keyboard
    Given I press the "table" button
      And I wait until I see the ".gallery__table" element
      # Move focus to the element before the table so we have a known starting point
      And I focus on the "#button-view-tile" element
    Given I press the "Tab" key globally
      And I press the "Tab" key globally
      And I press the "Tab" key globally
    Then the "#row-0 input[type='checkbox']" element should have focus
    # Select file 1
    When I press the "Space" key globally
    Then the file named "file001" in the gallery should be checked
    # Select file 2 - both should now be selected
    When I press the "Tab" key globally
      And I press the "Tab" key globally
      And I press the "Space" key globally
    Then the file named "file002" in the gallery should be checked
      And the file named "file001" in the gallery should be checked
      And the ".bulk-actions-counter" element should contain "2 selected"
    # Move focus to the actions box, which is currently BEFORE the table in the tab order
    When I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
      And I press the "Shift-Tab" key globally
    Then the "button.bulk-actions__action[value='move']" element should have focus
    When I press the "Enter" key globally
    Then I should see "Move 2 item(s) to..." in the ".modal-title" element
    When I press the "Tab" key globally
      And I press the "Tab" key globally
      And I press the "Down" key globally
      And I press the "Down" key globally
      And I press the "Space" key globally
    Then I should see "folder2/" in the "#Form_moveForm_FolderID_Holder .treedropdownfield__value-container" element
    When I press the "Tab" key globally
    Then the "button[name='action_move']" element should have focus
    When I press the "Enter" key globally
    Then I should see a "Moved 2 item(s) to folder2" success toast

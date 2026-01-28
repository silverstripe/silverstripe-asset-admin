@retry @job3
Feature: Accessibility asset-admin
  As a user with accessibility needs
  I want to be able to use asset-admin with accessibile technology

  Background:
    And the "group" "EDITOR" has permissions "Access to 'Files' section" and "FILE_EDIT_ALL"
    And I am logged in as a member of "EDITOR" group

  Scenario: Tab navigation on react edit form using arrow keys loads focused tab
    # Note - other react edit forms e.g. linkfield will use the same tab nav code
    # so only testing this here
    Given a "image" "assets/file1.jpg"
    And I go to "/admin/assets"
    And I click on the file named "file1" in the gallery
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

  Scenario: Keyboard navigation within the gallery view
    Given I have a config file "assets-pagination-limit-19.yml"
    # Set an explicit screen width as this determines the number of items per row
    # which in turn determines which element gets focus with certain key strokes.
    # In this case we expect 4 items per row.
    Given I set the screen width to 1024px
    # 10 folders, for 2 full rows and one half row
    Given a "folder" "folder01"
    And a "folder" "folder02"
    And a "folder" "folder03"
    And a "folder" "folder04"
    And a "folder" "folder05"
    And a "folder" "folder06"
    And a "folder" "folder07"
    And a "folder" "folder08"
    And a "folder" "folder09"
    And a "folder" "folder10"
    # 11 files - 2 full rows, 1 on its own, and 2 on a second page.
    And a "file" "file01" has "Filename"="document.pdf" and "Title"="file01"
    And a "file" "file02" has "Filename"="document.pdf" and "Title"="file02"
    And a "file" "file03" has "Filename"="document.pdf" and "Title"="file03"
    And a "image" "file04" has "Filename"="file1.jpg" and "Title"="file04"
    And a "image" "file05" has "Filename"="file1.jpg" and "Title"="file05"
    And a "image" "file06" has "Filename"="file1.jpg" and "Title"="file06"
    And a "image" "file07" has "Filename"="file1.jpg" and "Title"="file07"
    And a "image" "file08" has "Filename"="file1.jpg" and "Title"="file08"
    And a "image" "file09" has "Filename"="file1.jpg" and "Title"="file09"
    And a "image" "file10" has "Filename"="file1.jpg" and "Title"="file10"
    And a "image" "file11" has "Filename"="file1.jpg" and "Title"="file11"
    When I go to "/admin/assets"
    # Focus should not automatically move to the gallery grid when navigating to asset admin
    Then the folder named "folder01" should not have focus
    # Move focus to the element before the gallery so we have a known starting point
    When I focus on the "#button-view-table" element

    # Tab into and out of the gallery as a tab island
    When I press the "Tab" key globally
    Then the folder named "folder01" should have focus
    When I press the "Tab" key globally
    Then the ".paginator-page select" element should have focus
    When I press the "Shift-Tab" key globally
    Then the folder named "folder01" should have focus

    # Arrow keys navigate around the tree
    # Pressing left on the first item does nothing
    When I press the "Arrow_Left" key globally
    Then the folder named "folder01" should have focus
    When I press the "Arrow_Right" key globally
    And I press the "Arrow_Right" key globally
    Then the folder named "folder03" should have focus
    # Pressing up on the top-most row does nothing
    When I press the "Arrow_Up" key globally
    Then the folder named "folder03" should have focus
    When I press the "Arrow_Down" key globally
    Then the folder named "folder07" should have focus
    When I press the "Arrow_Down" key globally
    # Note this was not in the same column, but since it's the last folder it gets focus
    Then the folder named "folder10" should have focus
    # Crossing the folder/file boundary
    When I press the "Arrow_Down" key globally
    Then the file named "file02" should have focus
    When I press the "Arrow_Left" key globally
    Then the file named "file01" should have focus
    When I press the "Arrow_Left" key globally
    Then the folder named "folder10" should have focus
    When I press the "Arrow_Right" key globally
    Then the file named "file01" should have focus
    When I press the "Arrow_Down" key globally
    Then the file named "file05" should have focus
    # Left on the 1st column moves to the last column of the previous row
    When I press the "Arrow_Left" key globally
    Then the file named "file04" should have focus
    # Note going UP between the file/folder boundary puts you on the last folder
    # if there's no folders in that column
    When I press the "Arrow_Up" key globally
    Then the folder named "folder10" should have focus
    # Going back down uses the actual column, we don't track what column you were in previously
    When I press the "Arrow_Down" key globally
    Then the file named "file02" should have focus

    # Home/End keys
    When I press the "End" key globally
    Then the file named "file04" should have focus
    # Pressing End on the last column does nothing
    When I press the "End" key globally
    Then the file named "file04" should have focus
    When I press the "Home" key globally
    Then the file named "file01" should have focus
    # Pressing Home on the first column does nothing
    When I press the "Home" key globally
    Then the file named "file01" should have focus
    # Control-home and control-end take you to the first/last items respectively
    When I press the "Control-Home" key globally
    Then the folder named "folder01" should have focus
    When I press the "Control-End" key globally
    Then the file named "file09" should have focus
    # Pressing down when there's no files below takes you to the last file instead
    # unless you're on the last row
    When I press the "Arrow_Up" key globally
    Then the file named "file05" should have focus
    When I press the "Arrow_Right" key globally
    And I press the "Arrow_Down" key globally
    Then the file named "file09" should have focus

    # Enter on a file opens the edit form for the file
    When I press the "Enter" key globally
    Then I should see the "Form_fileEditForm" form
    And the "#Form_fileEditForm_Title" element should have focus
    And the file named "file09" should not have focus
    # tab back to the close button and close the form
    When I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Enter" key globally
    Then the file named "file09" should have focus
    And I should not see the "Form_fileEditForm" form

    # Tabbing in and out of the tab island should retain tabindex where you were
    # start on a file that isn't literally the last file, to avoid edge cases
    When I press the "Arrow_Up" key globally
    Then the file named "file05" should have focus
    When I press the "Tab" key globally
    And I press the "Shift-Tab" key globally
    Then the file named "file05" should have focus

    # Navigating to a different page in the gallery resets roving tabindex
    When I press the "Tab" key globally
    And I press the "Tab" key globally
    And I press the "Enter" key globally
    Then I should see the file named "file10" in the gallery
    And I should not see the file named "file01" in the gallery
    And the file named "file10" should have focus
    # Navigating back to the previous page doesn't keep old roving tabindex
    And I press the "Tab" key globally
    And I press the "Enter" key globally
    Then I should see the file named "file01" in the gallery
    And I should not see the file named "file10" in the gallery
    And the folder named "folder01" should have focus

    # Space selects/deselects files/folders (and doesn't change focus)
    When I press the "Space" key globally
    Then I should see an ".bulk-actions__action[value='edit']" element
    And the ".bulk-actions-counter" element should contain "1 selected"
    And the folder named "folder01" should have focus
    When I press the "Arrow_Down" key globally
    And I press the "Arrow_Down" key globally
    And I press the "Arrow_Down" key globally
    And I press the "Space" key globally
    Then the ".bulk-actions-counter" element should contain "2 selected"
    And the file named "file01" should have focus
    # deselect it again
    When I press the "Space" key globally
    And the ".bulk-actions-counter" element should contain "1 selected"
    And the file named "file01" should have focus

    # Uploading files should move focus to the new file
    When I attach the file "testfile.jpg" to dropzone "gallery-container"
    Then the file named "testfile" should have focus
    When I press the "Arrow_Right" key globally
    Then the file named "file01" should have focus
    When I attach the file "invalid.file" to dropzone "gallery-container"
    Then the file named "invalid" should have focus
    And I should see an error message on the file "invalid"
    When I press the "Arrow_Right" key globally
    Then the file named "file01" should have focus
    When I press the "Arrow_Left" key globally
    Then the file named "invalid" should have focus
    # Pressing enter on a failed upload removes it from the gallery
    # and moves focus to the element that takes its index
    When I press the "Enter" key globally
    Then I should not see the file named "invalid" in the gallery
    And the file named "file01" should have focus

    # Enter on a folder navigates to that folder
    When I press the "Control-Home" key globally
    And I press the "Arrow_Right" key globally
    And I press the "Enter" key globally
    Then I should see "folder02" in the ".breadcrumb__item--last .breadcrumb__item-title" element
    And the ".gallery__main-view--tile" element should have focus
    When I attach the file "invalid.file" to dropzone "gallery-container"
    Then the file named "invalid" should have focus
    When I press the "Enter" key globally
    Then I should not see the file named "invalid" in the gallery
    And the ".gallery__main-view--tile" element should have focus
    # Navigating back to the folder doens't retain the old tabindex
    # 9 tabs back to the breadcrumbs back button
    When I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Enter" key globally
    Then I should not see "folder02" in the ".breadcrumb__item--last .breadcrumb__item-title" element
    And the folder named "folder01" should have focus

    # Clicking to select an item sets the roving tabindex to the clicked item
    When I check the file named "file03" in the gallery
    Then the file named "file03" should have focus
    When I press the "Arrow_Right" key globally
    Then the file named "file04" should have focus
    # deselect all
    Given I click on the ".bulk-actions-counter" element

    # Clicking to open an item sets the roving tabindex to the clicked item
    When I click on the file named "file08" in the gallery
    # 6 tabs back to the gallery
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    Then the file named "file08" should have focus
    When I press the "Arrow_Right" key globally
    Then the file named "file09" should have focus

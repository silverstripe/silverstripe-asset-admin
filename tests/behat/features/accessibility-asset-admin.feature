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
    # Navigating back to the folder doesn't retain the old tabindex
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
    When I press the "Tab" key globally
    And I press the "Shift-Tab" key globally
    Then the file named "file03" should have focus
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

    # Swapping to table view, focus doesn't get entirely dropped and the table rows are focusable
    When I press the "Shift-Tab" key globally
    Then the "#button-view-table" element should have focus
    When I press the "Enter" key globally
    And I press the "Tab" key globally
    And I press the "Tab" key globally
    And I press the "Tab" key globally
    And I press the "Tab" key globally
    # first item in the grid should have focus
    Then the file named "file08" should have focus

  Scenario: Keyboard navigation within the table view
    Given I have a config file "assets-pagination-limit-10.yml"
    # 12 total items, 10 for this page plus some overflow.
    Given a "folder" "folder01"
    And a "folder" "folder02"
    And a "folder" "folder03"
    And a "file" "file01" has "Filename"="document.pdf" and "Title"="file01"
    And a "file" "file02" has "Filename"="document.pdf" and "Title"="file02"
    And a "file" "file03" has "Filename"="document.pdf" and "Title"="file03"
    And a "image" "file04" has "Filename"="file1.jpg" and "Title"="file04"
    And a "image" "file05" has "Filename"="file1.jpg" and "Title"="file05"
    And a "image" "file06" has "Filename"="file1.jpg" and "Title"="file06"
    And a "image" "file07" has "Filename"="file1.jpg" and "Title"="file07"
    And a "image" "file08" has "Filename"="file1.jpg" and "Title"="file08"
    And a "image" "file09" has "Filename"="file1.jpg" and "Title"="file09"
    When I go to "/admin/assets?view=table"
    # Focus should not automatically move to the gallery grid when navigating to asset admin
    Then the folder named "folder01" should not have focus
    # Move focus to the element before the table so we have a known starting point
    When I focus on the "#button-view-tile" element

    # Tab into and out of the table - header cells aren't in the tab island
    When I press the "Tab" key globally
    Then the ".gallery__table-column--title .gallery__table-column__sort-button" element should have focus
    When I press the "Tab" key globally
    Then the ".gallery__table-column--modified .gallery__table-column__sort-button" element should have focus
    When I press the "Tab" key globally
    Then the folder named "folder01" should have focus
    When I press the "Tab" key globally
    Then the ".paginator-page select" element should have focus
    When I press the "Shift-Tab" key globally
    Then the folder named "folder01" should have focus

    # Up/Down arrow keys navigate rows
    # Pressing up on the top-most row does nothing
    When I press the "Arrow_Up" key globally
    Then the folder named "folder01" should have focus
    When I press the "Arrow_Down" key globally
    Then the folder named "folder02" should have focus
    When I press the "Arrow_Down" key globally
    Then the folder named "folder03" should have focus
    When I press the "Arrow_Down" key globally
    Then the folder named "file01" should have focus
    When I press the "Arrow_Up" key globally
    Then the folder named "folder03" should have focus

    # Home/End keys on rows
    When I press the "End" key globally
    Then the file named "file07" should have focus
    # Pressing End or Down on the last row does nothing
    When I press the "End" key globally
    Then the file named "file07" should have focus
    When I press the "Arrow_Down" key globally
    Then the file named "file07" should have focus
    When I press the "Home" key globally
    Then the file named "folder01" should have focus
    # Pressing Home on the first row does nothing
    When I press the "Home" key globally
    Then the file named "folder01" should have focus

    # Left/Right keys navigates columns in the row
    # Pressing left on the first item does nothing
    When I press the "Arrow_Left" key globally
    Then the folder named "folder01" should have focus
    # Left and right navigates columns within the row
    When I press the "Arrow_Right" key globally
    Then the "Title" column for the folder named "folder01" should have focus
    When I press the "Arrow_Right" key globally
    Then the "Status" column for the folder named "folder01" should have focus
    When I press the "Arrow_Right" key globally
    Then the "Size" column for the folder named "folder01" should have focus
    When I press the "Arrow_Right" key globally
    Then the "Modified" column for the folder named "folder01" should have focus
    # Right arrow does nothing when we're on the right-most column
    When I press the "Arrow_Right" key globally
    Then the "Modified" column for the folder named "folder01" should have focus
    When I press the "Arrow_Left" key globally
    Then the "Size" column for the folder named "folder01" should have focus
    When I press the "Arrow_Left" key globally
    Then the "Status" column for the folder named "folder01" should have focus
    When I press the "Arrow_Left" key globally
    Then the "Title" column for the folder named "folder01" should have focus
    # Left arrow on the left-most column moves focus to the row as a whole
    When I press the "Arrow_Left" key globally
    Then the folder named "folder01" should have focus

    # Home/End keys on columns
    When I press the "Arrow_Right" key globally
    Then the "Title" column for the folder named "folder01" should have focus
    # Pressing Home on the first column does nothing
    When I press the "Home" key globally
    Then the "Title" column for the folder named "folder01" should have focus
    When I press the "End" key globally
    Then the "Modified" column for the folder named "folder01" should have focus
    # Pressing End on the last column does nothing
    When I press the "End" key globally
    Then the "Modified" column for the folder named "folder01" should have focus
    When I press the "Home" key globally
    Then the "Title" column for the folder named "folder01" should have focus

    # Up/Down keys when you're on a column keeps the column but navigates rows
    # Up key does nothing when you're on a column in the first row
    When I press the "Arrow_Up" key globally
    Then the "Title" column for the folder named "folder01" should have focus
    When I press the "Arrow_Right" key globally
    And I press the "Arrow_Up" key globally
    Then the "Status" column for the folder named "folder01" should have focus
    When I press the "Arrow_Down" key globally
    When I press the "Arrow_Down" key globally
    Then the "Status" column for the folder named "folder03" should have focus
    When I press the "Arrow_Up" key globally
    Then the "Status" column for the folder named "folder02" should have focus

    # Columns keep the roving tab index
    When I press the "Tab" key globally
    Then the ".paginator-page select" element should have focus
    When I press the "Shift-Tab" key globally
    Then the "Status" column for the folder named "folder02" should have focus

    # Enter and Space do nothing when focused on a column
    Given I should not see a ".bulk-actions" element
    And I should not see the "Form_fileEditForm" form
    When I press the "Space" key globally
    Then I should not see a ".bulk-actions" element
    And I should not see the "Form_fileEditForm" form
    And the "Status" column for the folder named "folder02" should have focus
    When I press the "Enter" key globally
    Then I should not see a ".bulk-actions" element
    And I should not see the "Form_fileEditForm" form
    And the "Status" column for the folder named "folder02" should have focus

    # Enter on a file opens the edit form for the file
    When I press the "Home" key globally
    And I press the "Arrow_Left" key globally
    And I press the "Arrow_Down" key globally
    And I press the "Arrow_Down" key globally
    And I press the "Arrow_Down" key globally
    Then the file named "file02" should have focus
    When I press the "Enter" key globally
    Then I should see the "Form_fileEditForm" form
    And the "#Form_fileEditForm_Title" element should have focus
    And the file named "file02" should not have focus
    # tab back to the close button and close the form
    When I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Enter" key globally
    Then the file named "file02" should have focus
    And I should not see the "Form_fileEditForm" form

    # Navigating to a different page in the gallery resets roving tabindex
    When I press the "Tab" key globally
    And I press the "Tab" key globally
    And I press the "Enter" key globally
    Then I should see the file named "file08" in the gallery
    And I should not see the file named "file01" in the gallery
    Then the ".gallery__table" element should have focus
    When I press the "Tab" key globally
    And I press the "Tab" key globally
    And I press the "Tab" key globally
    Then the folder named "file08" should have focus
    # Navigating back to the previous page doesn't keep old roving tabindex
    And I press the "Tab" key globally
    And I press the "Enter" key globally
    Then I should see the file named "file01" in the gallery
    And I should not see the file named "file08" in the gallery
    Then the ".gallery__table" element should have focus
    When I press the "Tab" key globally
    And I press the "Tab" key globally
    And I press the "Tab" key globally
    And the folder named "folder01" should have focus

    # Space selects/deselects files/folders (and doesn't change focus)
    When I press the "Space" key globally
    Then I should see a ".bulk-actions" element
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
    # deselect all and then go back to the table
    Given I click on the ".bulk-actions-counter" element
    And I press the "Shift-Tab" key globally

    # Uploading files should move focus to the new file
    When I attach the file "testfile.jpg" to dropzone "gallery-container"
    # wait a second to make sure the upload completes
    And I wait for 1 second
    Then I should see the "Form_fileEditForm" form
    And the "#Form_fileEditForm_Title" element should have focus
    When I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Enter" key globally
    Then I should not see the "Form_fileEditForm" form
    And the file named "testfile" should have focus
    When I press the "Arrow_Down" key globally
    Then the file named "file01" should have focus
    When I attach the file "invalid.file" to dropzone "gallery-container"
    Then the file named "invalid" should have focus
    And I should see an error message on the file "invalid"
    When I press the "Arrow_Down" key globally
    Then the file named "file01" should have focus
    When I press the "Arrow_Up" key globally
    Then the file named "invalid" should have focus
    # Pressing enter on a failed upload removes it from the table
    # and moves focus to the element that takes its index
    When I press the "Enter" key globally
    Then I should not see the file named "invalid" in the gallery
    And the file named "file01" should have focus

    # Sorting resets the roving tabindex
    When I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    Then the ".gallery__table-column--title .gallery__table-column__sort-button" element should have focus
    When I press the "Enter" key globally
    And I press the "Tab" key globally
    And I press the "Tab" key globally
    Then the folder named "folder03" should have focus
    # If a file is open, the tabindex moves to that file's row instead of to the first row
    When I press the "Down" key globally
    And I press the "Down" key globally
    And I press the "Down" key globally
    And I press the "Down" key globally
    And I press the "Down" key globally
    And I press the "Down" key globally
    And I press the "Down" key globally
    Then the file named "file06" should have focus
    When I press the "Enter" key globally
    And I press the "Title" button
    And I press the "Tab" key globally
    And I press the "Tab" key globally
    Then the file named "file06" should have focus

    # Enter on a folder navigates to that folder
    When I press the "Home" key globally
    And I press the "Arrow_Down" key globally
    And I press the "Enter" key globally
    Then I should see "folder02" in the ".breadcrumb__item--last .breadcrumb__item-title" element
    And the ".gallery__no-item-notice" element should have focus
    # Removing the last file moves focus to the table as a whole
    When I attach the file "invalid.file" to dropzone "gallery-container"
    Then the file named "invalid" should have focus
    When I press the "Enter" key globally
    Then I should not see the file named "invalid" in the gallery
    And the ".gallery__no-item-notice" element should have focus
    # Navigating back to the folder doens't retain the old tabindex
    # 8 tabs back to the breadcrumbs back button
    When I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Enter" key globally
    Then I should not see "folder02" in the ".breadcrumb__item--last .breadcrumb__item-title" element
    And the ".gallery__table" element should have focus
    And I press the "Tab" key globally
    And I press the "Tab" key globally
    And I press the "Tab" key globally
    Then the folder named "folder01" should have focus

    # Adding a folder moved roving tabindex to that folder - but does NOT move focus
    When I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    Then the "button#add-folder-button" element should have focus
    When I press the "Enter" key globally
    Then I should see the "Form_folderCreateForm" form
    And the "input#Form_folderCreateForm_Name" element should have focus
    When I type "new folder" in the field
    And I press the "Enter" key globally
    Then I should see the folder named "new-folder" in the gallery
    And the "input#Form_fileEditForm_Name" element should have focus
    # Five tabs back to the table
    When I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    Then the folder named "new-folder" should have focus

    # Clicking to select an item sets the roving tabindex to the clicked item
    When I check the file named "file03" in the gallery
    Then the file named "file03" should have focus
    When I press the "Arrow_Down" key globally
    Then the file named "file04" should have focus
    # deselect all
    Given I click on the ".bulk-actions-counter" element

    # Clicking to open an item sets the roving tabindex to the clicked item
    When I click on the file named "file05" in the gallery
    Then I should see the "Form_fileEditForm" form
    # Six tabs back to the table
    When I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    Then the file named "file05" should have focus
    When I press the "Arrow_Down" key globally
    Then the file named "file06" should have focus

    # Deleting a file focuses on the next file
    And I press the "Enter" key globally
    And I press the "Other actions" button
    And I press the "Delete" button
    And I press the "Delete" button inside the modal
    Then the file named "file07" should have focus

    # Deleting the last file focuses on the previous file
    # Navigate to page 2 first
    When I press the "Tab" key globally
    And I press the "Tab" key globally
    And I press the "Enter" key globally
    Then I should see the file named "file09" in the gallery
    When I press the "Arrow_Down" key globally
    And I press the "End" key globally
    Then the file named "testfile" should have focus
    # Delete the file
    And I press the "Enter" key globally
    And I press the "Other actions" button
    And I press the "Delete" button
    And I press the "Delete" button inside the modal
    Then the file named "file09" should have focus

    # Swapping to gallery view, focus doesn't get entirely dropped and the gallery is focusable
    When I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    And I press the "Shift-Tab" key globally
    Then the "#button-view-tile" element should have focus
    When I press the "Enter" key globally
    And I press the "Tab" key globally
    And I press the "Tab" key globally
    # first item in the grid should have focus
    Then the file named "file08" should have focus

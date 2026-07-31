@assets @retry @job3
Feature: Basic image editing
  As a cms author
  I want to crop, rotate and flip an image in the CMS
  So that the image itself is updated, with the original optionally kept as a backup copy

  Background:
    Given a "image" "folder1/file1.jpg"
    And a "file" "folder1/document.pdf"
    And the "group" "EDITOR" has permissions "Access to 'Files' section" and "FILE_EDIT_ALL"
    And I am logged in as a member of "EDITOR" group
    And I go to "/admin/assets"
    And I select the file named "folder1" in the gallery

  @javascript
  Scenario: I edit an image and the original is replaced, with a backup kept beside it
    When I click on the file named "file1" in the gallery
    And I wait for 5 seconds
    Then I should see an "#Form_fileEditForm" element
    When I press the "Other actions" button
    Then I should see a "Edit image" button
    When I press the "Edit image" button
    And I wait for 2 seconds
    Then I should see a "Apply" button
    # The modal offers the backup choice and signposts the draft-only write
    And I should see "Back up the original image"
    And I should see "The edited image will be saved as draft, publish the image to update it on the live site"
    When I press the "Rotate" button
    # A pointer activation arms the crosshair but draws no box, so the edit stays rotate-only.
    And I press the "Crop" button
    # The crop output readout only appears once the Crop tool is on
    And I should see "Cropped: 50 x 50"
    And I select "1:1" from the image editor aspect ratio dropdown
    And I press the "Apply" button
    And I wait for 5 seconds
    # The gallery listing is refetched from the server, so re-open the folder to see the backup
    And I go to "/admin/assets"
    And I wait for 5 seconds
    And I select the file named "folder1" in the gallery
    And I wait for 3 seconds
    # The backup is de-duplicated to file1-v2.jpg, shown in the CMS with the hyphen as a space
    Then I should see the file named "file1" in the gallery
      And I should see the file named "file1 v2" in the gallery
    # The backup is persisted as a draft only - it is never auto-published
    When I click on the file named "file1 v2" in the gallery
    And I wait for 3 seconds
    Then the rendered HTML should contain "<span class="editor__status-flag">Draft</span>"

  @javascript
  Scenario: I decline the backup and no backup copy is written
    When I click on the file named "file1" in the gallery
    And I wait for 5 seconds
    Then I should see an "#Form_fileEditForm" element
    When I press the "Other actions" button
    Then I should see a "Edit image" button
    When I press the "Edit image" button
    And I wait for 2 seconds
    Then I should see a "Apply" button
    When I uncheck "Back up the original image"
    And I press the "Rotate" button
    And I press the "Apply" button
    And I wait for 5 seconds
    # Re-open the folder listing: the original is still there and no backup was written
    And I go to "/admin/assets"
    And I wait for 5 seconds
    And I select the file named "folder1" in the gallery
    And I wait for 3 seconds
    Then I should see the file named "file1" in the gallery
      And I should not see the file named "file1 v2" in the gallery

  @javascript
  Scenario: I cancel the image editor and nothing is written
    When I click on the file named "file1" in the gallery
    And I wait for 5 seconds
    Then I should see an "#Form_fileEditForm" element
    When I press the "Other actions" button
    Then I should see a "Edit image" button
    When I press the "Edit image" button
    And I wait for 2 seconds
    Then I should see a "Apply" button
    # Nothing has been changed yet, so there is nothing to apply
    And the "Apply" button should be disabled
    # Arm an edit (rotate) but press Cancel instead of Apply - nothing must be written to disk
    When I press the "Rotate" button
    And I press the "Cancel" button
    And I wait for 2 seconds
    # Re-open the folder listing: the original is untouched and no backup copy was created
    And I go to "/admin/assets"
    And I wait for 5 seconds
    And I select the file named "folder1" in the gallery
    And I wait for 3 seconds
    Then I should see the file named "file1" in the gallery
      And I should not see the file named "file1 v2" in the gallery

  @javascript
  Scenario: I resize an image with the aspect ratio locked
    When I click on the file named "file1" in the gallery
    And I wait for 5 seconds
    Then I should see an "#Form_fileEditForm" element
    When I press the "Other actions" button
    Then I should see a "Edit image" button
    When I press the "Edit image" button
    And I wait for 2 seconds
    Then I should see a "Apply" button
    # No crop output is reported while the Crop tool is off - it would restate the original.
    And I should see "Original: 50 x 50"
    And I should not see "Cropped: 50 x 50"
    # Typing one dimension derives the other; the ratio is locked.
    When I fill in "image-editor-modal-width" with "20"
    And I wait for 2 seconds
    Then the "image-editor-modal-height" field should contain "20"
    When I press the "Apply" button
    And I wait for 5 seconds
    # Re-open the record from a fresh page load: the original itself was replaced, so the editor now
    # reports the resized image as the stored original
    And I go to "/admin/assets"
    And I wait for 5 seconds
    And I select the file named "folder1" in the gallery
    And I wait for 3 seconds
    And I click on the file named "file1" in the gallery
    And I wait for 5 seconds
    And I press the "Other actions" button
    And I press the "Edit image" button
    And I wait for 2 seconds
    Then I should see "Original: 20 x 20"

  @javascript
  Scenario: I am told when a resize would enlarge the image
    When I click on the file named "file1" in the gallery
    And I wait for 5 seconds
    Then I should see an "#Form_fileEditForm" element
    When I press the "Other actions" button
    Then I should see a "Edit image" button
    When I press the "Edit image" button
    And I wait for 2 seconds
    Then I should see a "Apply" button
    # Resizing may only shrink. The typed value is left as entered rather than clamped.
    When I fill in "image-editor-modal-width" with "60"
    And I wait for 2 seconds
    Then I should see "Cannot be larger than the original image (50 x 50)"
    And the "image-editor-modal-width" field should contain "60"
    And the "Apply" button should be disabled

  @javascript
  Scenario: A non-image file offers no Edit image action
    When I click on the file named "document" in the gallery
    And I wait for 5 seconds
    Then I should see an "#Form_fileEditForm" element
    When I press the "Other actions" button
    Then I should not see a "Edit image" button

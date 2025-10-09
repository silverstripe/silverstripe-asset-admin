@retry @job3
Feature: Accessibility asset-admin
  As a user with accessibility needs
  I want to be able to use asset-admin with accessibile technology

  Scenario: Tab navigation on react edit form using arrow keys loads focused tab
    # Note - othres react edit forms e.g. linkfield will use the same tab nav code
    # so only testing this here
    Given a "image" "assets/file1.jpg"
    And the "group" "EDITOR" has permissions "Access to 'Files' section" and "FILE_EDIT_ALL"
    And I am logged in as a member of "EDITOR" group
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

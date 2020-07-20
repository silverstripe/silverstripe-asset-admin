@javascript @assets @retry
Feature: Manage file permissions
  As a cms author
  I want to see file status icons
  So that I know the status of a file

  Background:
    Given a "image" "assets/file1.jpg" was created "2010-01-01 12:00:00"
    And a "image" "assets/folder1/file2.jpg" was created "2010-01-01 12:00:00"
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/assets"

  Scenario: I see a restricted access icon
    When I click on the file named "file1" in the gallery
    # status icon on the folder in the file list
    Then I should not see a file status icon with the class ".gallery-item .font-icon-user-lock"
    When I click "Permissions" in the "#Editor .nav-tabs" element
    And I select "Logged-in users" from "Who can view this file?" input group
    And I press the "Save" button
    And I wait for 5 seconds
    # status icon on the file in the file list
    Then I should see a file status icon with the class ".gallery-item .font-icon-user-lock"
    # status icon on the file in the file edit panel
    Then I should see a file status icon with the class ".editor-header .font-icon-user-lock"

  Scenario: I see a restricted access icon for inherited permissions
    When I click on the file named "folder1" in the gallery
    # status icon on the folder in the file list
    Then I should not see a file status icon with the class ".gallery-item .font-icon-user-lock"
    When I go to "/admin/assets"
    And I check the folder named "folder1" in the gallery
    And I press the "Edit" button
    When I click "Permissions" in the "#Editor .nav-tabs" element
    And I select "Logged-in users" from "Who can view this file?" input group
    And I press the "Save" button
    And I wait for 5 seconds
    # status icon on the folder in the file list
    Then I should see a file status icon with the class ".gallery-item .font-icon-user-lock"
    # status icon on the folder in the file edit panel
    Then I should see a file status icon with the class ".editor-header .font-icon-user-lock"
    And I click on the file named "folder1" in the gallery
    # status icon on the folder breadcrumb
    Then I should see a file status icon with the class ".breadcrumb__item-title .font-icon-user-lock"
    # status icon on the file
    Then I should see a file status icon with the class ".gallery-item .font-icon-user-lock"

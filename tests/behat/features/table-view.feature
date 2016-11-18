@assets
Feature: Change view for asset admin
  As a cms author
  I want to change the way I'm viewing files

  Background:
    Given a "image" "folder1/file1.jpg"
    And a "image" "folder1/file2.jpg"
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/assets"

  @assets
  Scenario: I can switch the gallery between table and thumbnail mode
    Given I click "" in the "#button-view-table" element
    Then I wait until I see the ".gallery__table-row" element
    Then I should see a ".gallery__main-view--table" element
    Then I should see a ".gallery__table-column-image" element
    When I click "" in the "#button-view-tile" element
    Then I wait until I see the ".gallery-item" element
    Then I should see a ".gallery__sort" element
    Then I should see a ".gallery__main-view--tile" element

  @assets
  Scenario: I can open a folder and file by clicking the row
    Given I click "" in the "#button-view-table" element
    Then I wait until I see the ".gallery__table-row" element
    When I click "folder1" in the ".gallery__table-row" element
    Then I wait until I see the ".gallery__table-row" element
    When I click "file1" in the ".gallery__table-row" element
    Then I wait until I see the "#Form_FileEditForm" element

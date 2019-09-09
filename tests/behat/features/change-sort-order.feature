@assets @retry
Feature: Change view for asset admin
  As a cms author
  I want to change the way I'm viewing files

  Background:
    Given a "image" "folder1/file1.jpg"
      And a "image" "folder1/file2.jpg"
      And I am logged in with "ADMIN" permissions
      And I go to "/admin/assets"

  Scenario: I can switch the sorting order in list view
    When I click on the file named "folder1" in the gallery
      And I click the ".gallery__sort a" element
      And I wait until I see the ".gallery__sort .chosen-results" element
      And I click "title z-a" in the ".gallery__sort .chosen-results" element
    Then I should see the gallery item "file2" in position "1"
      And I should see the gallery item "file1" in position "2"
    When I click the ".gallery__sort a" element
      And I wait until I see the ".gallery__sort .chosen-results" element
      And I click "title a-z" in the ".gallery__sort .chosen-results" element
    Then I should see the gallery item "file1" in position "1"
      And I should see the gallery item "file2" in position "2"

  Scenario: I can switch the sorting order in table view
    When I click on the file named "folder1" in the gallery
      And I press the "table" button
      And I wait until I see the ".gallery__table-row" element
    Then I should see the gallery item "file1" in position "1"
      And I should see the gallery item "file2" in position "2"
    When I click "Title" in the ".gallery__table thead" element
    Then I should see the gallery item "file2" in position "1"
      And I should see the gallery item "file1" in position "2"

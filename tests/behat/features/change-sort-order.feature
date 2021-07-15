@assets @retry
Feature: Change view for asset admin
  As a cms author
  I want to change the way I'm viewing files

  Background:
    Given a "file" "folder1/document.pdf"
      And a "image" "folder1/file1.jpg"
      And a "image" "folder1/file2.jpg"
      # Adding multiple versions of folder/testfile.jpg is intentional
      # We do this to get paginated results to test that folders
      # are always at the top of the results that contain normal files and images
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      And a "image" "folder1/testfile.jpg"
      # subfolder names must start with a letter greater than "t"
      And a "image" "folder1/xsubfolder1/testfile.jpg"
      And a "image" "folder1/zsubfolder2/testfile.jpg"
      And I am logged in with "ADMIN" permissions
      And I go to "/admin/assets"

  Scenario: I can switch the sorting order in table view
    When I click on the file named "folder1" in the gallery
      And I click on the ".gallery__sort a" element
      And I wait until I see the ".gallery__sort .chosen-results" element
      And I click "Title Z-A" in the ".gallery__sort .chosen-results" element
    Then I should see the table gallery folder "zsubfolder2" in position "1"
      And I should see the table gallery folder "xsubfolder1" in position "2"
      And I should see the gallery item "testfile v9" in position "1"
      And I should see the gallery item "testfile v8" in position "2"
    When I click on the ".gallery__sort a" element
      And I wait until I see the ".gallery__sort .chosen-results" element
      And I click "Title A-Z" in the ".gallery__sort .chosen-results" element
    Then I should see the table gallery folder "xsubfolder1" in position "1"
      And I should see the table gallery folder "zsubfolder2" in position "2"
      And I should see the gallery item "document" in position "1"
      And I should see the gallery item "file1" in position "2"

  Scenario: I can switch the sorting order in list view
    When I click on the file named "folder1" in the gallery
      And I press the "table" button
      And I wait until I see the ".gallery__table-row" element
    Then I should see the gallery item "xsubfolder1" in position "1"
      And I should see the gallery item "zsubfolder2" in position "2"
      And I should see the gallery item "document" in position "3"
      And I should see the gallery item "file1" in position "4"
    When I click "Title" in the ".gallery__table thead" element
    Then I should see the gallery item "zsubfolder2" in position "1"
      And I should see the gallery item "xsubfolder1" in position "2"
      And I should see the gallery item "testfile v9" in position "3"
      And I should see the gallery item "testfile v8" in position "4"

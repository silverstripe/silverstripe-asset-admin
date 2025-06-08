@assets @retry @job1
Feature: Change view for asset admin
  As a cms author
  I want to change the way I'm viewing files

  Background:
    Given a "file" "file001" has "Filename"="folder1/document.pdf" and "Title"="file001"
      And a "image" "file002" has "Filename"="folder1/file1.jpg" and "Title"="file002"
      And a "image" "file003" has "Filename"="folder1/file2.jpg" and "Title"="file003"
      # Adding multiple versions of folder/testfile.jpg is intentional
      # We do this to get paginated results to test that folders
      # are always at the top of the results that contain normal files and images
      And a "image" "file004" has "Filename"="folder1/testfile.jpg" and "Title"="file004"
      And a "image" "file005" has "Filename"="folder1/testfile.jpg" and "Title"="file005"
      And a "image" "file006" has "Filename"="folder1/testfile.jpg" and "Title"="file006"
      And a "image" "file007" has "Filename"="folder1/testfile.jpg" and "Title"="file007"
      And a "image" "file008" has "Filename"="folder1/testfile.jpg" and "Title"="file008"
      And a "image" "file009" has "Filename"="folder1/testfile.jpg" and "Title"="file009"
      And a "image" "file010" has "Filename"="folder1/testfile.jpg" and "Title"="file010"
      And a "image" "file011" has "Filename"="folder1/testfile.jpg" and "Title"="file011"
      And a "image" "file012" has "Filename"="folder1/testfile.jpg" and "Title"="file012"
      And a "image" "file013" has "Filename"="folder1/testfile.jpg" and "Title"="file013"
      And a "image" "file014" has "Filename"="folder1/testfile.jpg" and "Title"="file014"
      And a "image" "file015" has "Filename"="folder1/testfile.jpg" and "Title"="file015"
      And a "image" "file016" has "Filename"="folder1/testfile.jpg" and "Title"="file016"
      And a "image" "file017" has "Filename"="folder1/testfile.jpg" and "Title"="file017"
      And a "image" "file018" has "Filename"="folder1/testfile.jpg" and "Title"="file018"
      And a "image" "file019" has "Filename"="folder1/testfile.jpg" and "Title"="file019"
      And a "image" "file020" has "Filename"="folder1/testfile.jpg" and "Title"="file020"
      And a "image" "file021" has "Filename"="folder1/testfile.jpg" and "Title"="file021"
      And a "image" "file022" has "Filename"="folder1/testfile.jpg" and "Title"="file022"
      And a "image" "file023" has "Filename"="folder1/testfile.jpg" and "Title"="file023"
      And a "image" "file024" has "Filename"="folder1/testfile.jpg" and "Title"="file024"
      And a "image" "file025" has "Filename"="folder1/testfile.jpg" and "Title"="file025"
      And a "image" "file026" has "Filename"="folder1/testfile.jpg" and "Title"="file026"
      And a "image" "file027" has "Filename"="folder1/testfile.jpg" and "Title"="file027"
      And a "image" "file028" has "Filename"="folder1/testfile.jpg" and "Title"="file028"
      And a "image" "file029" has "Filename"="folder1/testfile.jpg" and "Title"="file029"
      And a "image" "file030" has "Filename"="folder1/testfile.jpg" and "Title"="file030"
      And a "image" "file031" has "Filename"="folder1/testfile.jpg" and "Title"="file031"
      And a "image" "file032" has "Filename"="folder1/testfile.jpg" and "Title"="file032"
      And a "image" "file033" has "Filename"="folder1/testfile.jpg" and "Title"="file033"
      And a "image" "file034" has "Filename"="folder1/testfile.jpg" and "Title"="file034"
      And a "image" "file035" has "Filename"="folder1/testfile.jpg" and "Title"="file035"
      And a "image" "file036" has "Filename"="folder1/testfile.jpg" and "Title"="file036"
      And a "image" "file037" has "Filename"="folder1/testfile.jpg" and "Title"="file037"
      And a "image" "file038" has "Filename"="folder1/testfile.jpg" and "Title"="file038"
      And a "image" "file039" has "Filename"="folder1/testfile.jpg" and "Title"="file039"
      And a "image" "file040" has "Filename"="folder1/testfile.jpg" and "Title"="file040"
      And a "image" "file041" has "Filename"="folder1/testfile.jpg" and "Title"="file041"
      And a "image" "file042" has "Filename"="folder1/testfile.jpg" and "Title"="file042"
      And a "image" "file043" has "Filename"="folder1/testfile.jpg" and "Title"="file043"
      And a "image" "file044" has "Filename"="folder1/testfile.jpg" and "Title"="file044"
      And a "image" "file045" has "Filename"="folder1/testfile.jpg" and "Title"="file045"
      And a "image" "file046" has "Filename"="folder1/testfile.jpg" and "Title"="file046"
      And a "image" "file047" has "Filename"="folder1/testfile.jpg" and "Title"="file047"
      And a "image" "file048" has "Filename"="folder1/testfile.jpg" and "Title"="file048"
      # subfolder names must start with a letter greater than "t"
      And a "image" "folder1/xsubfolder1/testfile.jpg"
      And a "image" "folder1/zsubfolder2/testfile.jpg"
      And the "group" "EDITOR" has permissions "Access to 'Files' section" and "FILE_EDIT_ALL"
      And I am logged in as a member of "EDITOR" group
      And I go to "/admin/assets"

  Scenario: I can switch the sorting order in table view
    When I click on the file named "folder1" in the gallery
      And I click on the ".gallery__sort a" element
      And I wait until I see the ".gallery__sort .chosen-results" element
      And I click "Title Z-A" in the ".gallery__sort .chosen-results" element
    # Folders are always first (but sorted) on page 1
    Then I should see the table gallery folder "zsubfolder2" in position "1"
      And I should see the table gallery folder "xsubfolder1" in position "2"
      And I should see the gallery item "file048" in position "1"
      And I should see the gallery item "file047" in position "2"
      # Note 50 total files and folders - so 48 files excluding folders
      And I should see the gallery item "file001" in position "48"
    When I click on the ".gallery__sort a" element
      And I wait until I see the ".gallery__sort .chosen-results" element
      And I click "Title A-Z" in the ".gallery__sort .chosen-results" element
    Then I should see the table gallery folder "xsubfolder1" in position "1"
      And I should see the table gallery folder "zsubfolder2" in position "2"
      And I should see the gallery item "file001" in position "1"
      And I should see the gallery item "file002" in position "2"

  Scenario: I can switch the sorting order in list view
    When I click on the file named "folder1" in the gallery
      And I press the "table" button
      And I wait until I see the ".gallery__table-row" element
    Then I should see the gallery item "xsubfolder1" in position "1"
      And I should see the gallery item "zsubfolder2" in position "2"
      And I should see the gallery item "file001" in position "3"
      And I should see the gallery item "file002" in position "4"
      And I should see the gallery item "file048" in position "50"
    When I click "Title" in the ".gallery__table thead" element
    Then I should see the gallery item "zsubfolder2" in position "1"
      And I should see the gallery item "xsubfolder1" in position "2"
      And I should see the gallery item "file048" in position "3"
      And I should see the gallery item "file047" in position "4"
      And I should see the gallery item "file001" in position "50"

  Scenario: Sort order works as expected across pages
    Given I have a config file "assets-pagination-limit.yml"
      And I go to "/admin/assets"
      And I click on the file named "folder1" in the gallery
    Then I should see the file named "zsubfolder2" in the gallery
      And I should see the table gallery folder "xsubfolder1" in position "1"
      And I should see the table gallery folder "zsubfolder2" in position "2"
      And I should see the gallery item "file001" in position "1"
      And I should see the gallery item "file002" in position "2"
      # 10 total file and folders - so 8 files excluding folders
      And I should see the gallery item "file008" in position "8"
    When I press the "Next" button
    Then I should not see the file named "zsubfolder2" in the gallery
      And I should see the gallery item "file009" in position "1"
      And I should see the gallery item "file010" in position "2"
      # no folders on this page so we get 10 full items
      And I should see the gallery item "file018" in position "10"
    When I click on the ".gallery__sort a" element
      And I wait until I see the ".gallery__sort .chosen-results" element
      And I click "Title Z-A" in the ".gallery__sort .chosen-results" element
    # Note that sorting kicks us back to page 1
    Then I should see the gallery item "file048" in position "1"
      And I should see the gallery item "file041" in position "8"
    When I press the "Next" button
    Then I should see the gallery item "file040" in position "1"
      And I should see the gallery item "file031" in position "10"

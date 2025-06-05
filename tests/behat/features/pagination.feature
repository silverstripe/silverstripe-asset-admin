@assets @retry @job1
Feature: Pagination for asset admin
  As a cms author
  I want pagination to work as expected

  Background:
    Given I have a config file "assets-pagination-limit.yml"
      And a "company" "ACME inc"
      And a "file" "file001" has "Filename"="folder1/document.pdf" and "Title"="file001"
      And a "image" "file002" has "Filename"="folder1/file1.jpg" and "Title"="file002"
      And a "image" "file003" has "Filename"="folder1/file2.jpg" and "Title"="file003"
      # Adding multiple versions of folder/testfile.jpg is intentional
      # We do this to avoid having to provide 50 files in tests/behat/files/
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
      And a "image" "file049" has "Filename"="folder1/testfile.jpg" and "Title"="file049"
      And a "image" "file050" has "Filename"="folder1/testfile.jpg" and "Title"="file050"
      And the "group" "EDITOR" has permissions "VIEW_DRAFT_CONTENT" and "Access to 'Test ModelAdmin' section" and "TEST_DATAOBJECT_EDIT" and "Access to 'Files' section" and "FILE_EDIT_ALL"
      And I am logged in as a member of "EDITOR" group

  Scenario: I can use pagination in table view
    Given I go to "/admin/assets"
    When I click on the file named "folder1" in the gallery
    Then I should not see the ".paginator-prev button" element
      And I should see the ".paginator-next button" element
      # We should have 5 pages (exactly 50 files, 10 per page)
      And I should see "1" in the ".paginator-page" element
      And I should see "5" in the ".paginator-page" element
      And I should not see "6" in the ".paginator-page" element
      And the "1" option is selected in the ".paginator-page select" dropdown
      And I should see the gallery item "file001" in position "1"
      And I should see the gallery item "file010" in position "10"
    When I press the "Next" button
    Then I should see the ".paginator-prev button" element
      And I should see the ".paginator-next button" element
      And the "2" option is selected in the ".paginator-page select" dropdown
      And I should see the gallery item "file011" in position "1"
      And I should see the gallery item "file020" in position "10"
    When I select "5" in the ".paginator-page select" dropdown
    Then I should see the ".paginator-prev button" element
      And I should not see the ".paginator-next button" element
      And the "5" option is selected in the ".paginator-page select" dropdown
      And I should see the gallery item "file041" in position "1"
      And I should see the gallery item "file050" in position "10"
    When I press the "Previous" button
    Then I should see the ".paginator-prev button" element
      And I should see the ".paginator-next button" element
      And the "4" option is selected in the ".paginator-page select" dropdown
      And I should see the gallery item "file031" in position "1"
      And I should see the gallery item "file040" in position "10"

  Scenario: I can use pagination in list view
    Given I go to "/admin/assets"
    When I click on the file named "folder1" in the gallery
      And I press the "table" button
      And I wait until I see the ".gallery__table-row" element
    Then I should not see the ".paginator-prev button" element
      And I should see the ".paginator-next button" element
      # We should have 5 pages (exactly 50 files, 10 per page)
      And I should see "1" in the ".paginator-page" element
      And I should see "5" in the ".paginator-page" element
      And I should not see "6" in the ".paginator-page" element
      And the "1" option is selected in the ".paginator-page select" dropdown
      And I should see the gallery item "file001" in position "1"
      And I should see the gallery item "file010" in position "10"
    When I press the "Next" button
    Then I should see the ".paginator-prev button" element
      And I should see the ".paginator-next button" element
      And the "2" option is selected in the ".paginator-page select" dropdown
      And I should see the gallery item "file011" in position "1"
      And I should see the gallery item "file020" in position "10"
    When I select "5" in the ".paginator-page select" dropdown
    Then I should see the ".paginator-prev button" element
      And I should not see the ".paginator-next button" element
      And the "5" option is selected in the ".paginator-page select" dropdown
      And I should see the gallery item "file041" in position "1"
      And I should see the gallery item "file050" in position "10"
    When I press the "Previous" button
    Then I should see the ".paginator-prev button" element
      And I should see the ".paginator-next button" element
      And the "4" option is selected in the ".paginator-page select" dropdown
      And I should see the gallery item "file031" in position "1"
      And I should see the gallery item "file040" in position "10"

  Scenario: I can use pagination in an UploadField modal
    Given I go to "/admin/test/"
      And I click "ACME inc" in the "#Form_EditForm_SilverStripe-FrameworkTest-Model-Company" element
    Then I should see an ".uploadfield" element
    When I click "Choose existing" in the ".uploadfield" element
      And I press the "Back" HTML field button
      And I select the file named "folder1" in the gallery
    Then I should not see the ".paginator-prev button" element
      And I should see the ".paginator-next button" element
      # We should have 5 pages (exactly 50 files, 10 per page)
      And I should see "1" in the ".paginator-page" element
      And I should see "5" in the ".paginator-page" element
      And I should not see "6" in the ".paginator-page" element
      And the "1" option is selected in the ".paginator-page select" dropdown
      And I should see the gallery item "file001" in position "1"
      And I should see the gallery item "file010" in position "10"
    When I press the "Next" button
    Then I should see the ".paginator-prev button" element
      And I should see the ".paginator-next button" element
      And the "2" option is selected in the ".paginator-page select" dropdown
      And I should see the gallery item "file011" in position "1"
      And I should see the gallery item "file020" in position "10"
    When I select "5" in the ".paginator-page select" dropdown
    Then I should see the ".paginator-prev button" element
      And I should not see the ".paginator-next button" element
      And the "5" option is selected in the ".paginator-page select" dropdown
      And I should see the gallery item "file041" in position "1"
      And I should see the gallery item "file050" in position "10"
    When I press the "Previous" button
    Then I should see the ".paginator-prev button" element
      And I should see the ".paginator-next button" element
      And the "4" option is selected in the ".paginator-page select" dropdown
      And I should see the gallery item "file031" in position "1"
      And I should see the gallery item "file040" in position "10"

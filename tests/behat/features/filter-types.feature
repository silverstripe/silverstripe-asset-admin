@assets @retry @job1
Feature: Filter in asset admin
  As a cms author
  I want to filter files in various ways

  Background:
    Given a "company" "ACME inc"
      And a "file" "file001" has "Filename"="folder1/document.pdf" and "Title"="file001"
      And a "image" "file002" has "Filename"="folder1/file1.jpg" and "Title"="file002"
      And a "image" "file003" has "Filename"="folder1/file2.jpg" and "Title"="file003"
      # Adding multiple versions of folder/testfile.jpg is intentional
      # We do this to avoid having to provide so many files in tests/behat/files/
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
      # subfolder names must start with a letter greater than "t"
      And a "image" "file01" has "Filename"="folder1/xsubfolder1/file1.jpg" and "Title"="file01"
      And a "image" "file02" has "Filename"="folder1/zsubfolder2/file2.jpg" and "Title"="file02"
      And the "group" "EDITOR" has permissions "VIEW_DRAFT_CONTENT" and "Access to 'Test ModelAdmin' section" and "TEST_DATAOBJECT_EDIT" and "Access to 'Files' section" and "FILE_EDIT_ALL"
      And I am logged in as a member of "EDITOR" group

  Scenario: I can filter by name in gallery view
    Given I go to "/admin/assets"
    When I click on the file named "folder1" in the gallery
      And I click on the file named "xsubfolder1" in the gallery
      And I press the "Show search" button
      And I fill in "SearchBox__name" with "file01"
      And I press the "Enter" key in the "SearchBox__name" field
    Then I should see the file named "file010" in the gallery
      And I should see the file named "file019" in the gallery
      And I should see the file named "file01" in the gallery
      And I should not see the file named "file021" in the gallery
      And I should not see the file named "file001" in the gallery
      And I should not see the file named "file02" in the gallery
    When I press the "Close" button
      And I click on the file named "folder1" in the gallery
      And I click on the file named "xsubfolder1" in the gallery
      And I press the "Show search" button
      And I press the "Advanced" button
      And I check "Limit to current folder and its sub-folders?"
      And I press the "Search" button
    Then I should not see the file named "file001" in the gallery
      And I should not see the file named "file010" in the gallery
      And I should not see the file named "file02" in the gallery

  Scenario: I can filter by name in list view
    Given I go to "/admin/assets"
    Given I press the "table" button
      And I wait until I see the ".gallery__table-row" element
    When I click on the file named "folder1" in the gallery
      And I click on the file named "xsubfolder1" in the gallery
      And I press the "Show search" button
      And I fill in "SearchBox__name" with "file01"
      And I press the "Enter" key in the "SearchBox__name" field
    Then I should see the file named "file010" in the gallery
      And I should see the file named "file019" in the gallery
      And I should see the file named "file01" in the gallery
      And I should not see the file named "file021" in the gallery
      And I should not see the file named "file001" in the gallery
      And I should not see the file named "file02" in the gallery
    When I press the "Close" button
      And I click on the file named "folder1" in the gallery
      And I click on the file named "xsubfolder1" in the gallery
      And I press the "Show search" button
      And I press the "Advanced" button
      And I check "Limit to current folder and its sub-folders?"
      And I press the "Search" button
    Then I should not see the file named "file001" in the gallery
      And I should not see the file named "file010" in the gallery
      And I should not see the file named "file02" in the gallery

  Scenario: I can filter by name in an UploadField modal
    Given I go to "/admin/test/"
      And I click "ACME inc" in the "#Form_EditForm_SilverStripe-FrameworkTest-Model-Company" element
    Then I should see an ".uploadfield" element
    When I click "Choose existing" in the ".uploadfield" element
      And I press the "Back" HTML field button
      And I click on the file named "folder1" in the gallery
      And I click on the file named "xsubfolder1" in the gallery
      And I press the "Show search" button
      And I fill in "SearchBox__name" with "file01"
      And I press the "Enter" key in the "SearchBox__name" field
    Then I should see the file named "file010" in the gallery
      And I should see the file named "file019" in the gallery
      And I should see the file named "file01" in the gallery
      And I should not see the file named "file021" in the gallery
      And I should not see the file named "file001" in the gallery
      And I should not see the file named "file02" in the gallery
    When I press the "Close" button
      And I click on the file named "folder1" in the gallery
      And I click on the file named "xsubfolder1" in the gallery
      And I press the "Show search" button
      And I press the "Advanced" button
      And I check "Limit to current folder and its sub-folders?"
      And I press the "Search" button
    Then I should not see the file named "file001" in the gallery
      And I should not see the file named "file010" in the gallery
      And I should not see the file named "file02" in the gallery

  Scenario: I can filter by category in gallery view
    Given I go to "/admin/assets"
    When I click on the file named "folder1" in the gallery
      And I press the "Show search" button
      And I press the "Advanced" button
      And I select "Image" in the "File type" dropdown
      And I press the "Search" button
    Then I should see the file named "file002" in the gallery
      And I should see the file named "file021" in the gallery
      And I should see the file named "file01" in the gallery
      And I should not see the file named "file001" in the gallery
    When I press the "Advanced" button
      And I select "Document" in the "File type" dropdown
      And I press the "Search" button
    Then I should see the file named "file001" in the gallery
      And I should not see the file named "file002" in the gallery
      And I should not see the file named "file021" in the gallery
      And I should not see the file named "file01" in the gallery

  Scenario: I can filter by category in list view
    Given I go to "/admin/assets"
    Given I press the "table" button
    When I click on the file named "folder1" in the gallery
      And I press the "Show search" button
      And I press the "Advanced" button
      And I select "Image" in the "File type" dropdown
      And I press the "Search" button
    Then I should see the file named "file002" in the gallery
      And I should see the file named "file021" in the gallery
      And I should see the file named "file01" in the gallery
      And I should not see the file named "file001" in the gallery
    When I press the "Advanced" button
      And I select "Document" in the "File type" dropdown
      And I press the "Search" button
    Then I should see the file named "file001" in the gallery
      And I should not see the file named "file002" in the gallery
      And I should not see the file named "file021" in the gallery
      And I should not see the file named "file01" in the gallery

  Scenario: I can filter by category in an UploadField modal
    Given I go to "/admin/test/"
      And I click "ACME inc" in the "#Form_EditForm_SilverStripe-FrameworkTest-Model-Company" element
    Then I should see an ".uploadfield" element
    When I click "Choose existing" in the ".uploadfield" element
      And I press the "Back" HTML field button
      And I click on the file named "folder1" in the gallery
      And I press the "Show search" button
      And I press the "Advanced" button
      And I select "Image" in the "File type" dropdown
      And I press the "Search" button
    Then I should see the file named "file002" in the gallery
      And I should see the file named "file021" in the gallery
      And I should see the file named "file01" in the gallery
      And I should not see the file named "file001" in the gallery
    When I press the "Advanced" button
      And I select "Document" in the "File type" dropdown
      And I press the "Search" button
    Then I should see the file named "file001" in the gallery
      And I should not see the file named "file002" in the gallery
      And I should not see the file named "file021" in the gallery
      And I should not see the file named "file01" in the gallery

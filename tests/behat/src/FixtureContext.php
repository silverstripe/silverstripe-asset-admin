<?php

namespace SilverStripe\AssetAdmin\Tests\Behat\Context;

use Behat\Behat\Hook\Scope\BeforeScenarioScope;
use Behat\Mink\Element\DocumentElement;
use Behat\Mink\Element\NodeElement;
use Page;
use PHPUnit\Framework\Assert;
use SilverStripe\Assets\Image;
use SilverStripe\BehatExtension\Context\BasicContext;
use SilverStripe\BehatExtension\Context\FixtureContext as BaseFixtureContext;
use SilverStripe\BehatExtension\Utility\StepHelper;

/**
 * Context used to create fixtures in the SilverStripe ORM.
 */
class FixtureContext extends BaseFixtureContext
{
    use StepHelper;

    private ?BasicContext $basicContext = null;


    /** @BeforeScenario */
    public function gatherContexts(BeforeScenarioScope $scope)
    {
        $this->basicContext = $scope->getEnvironment()->getContext(BasicContext::class);
    }

    /**
     * Select a gallery item by type and name
     *
     * @Given /^I (?:(?:click on)|(?:select)) the (?:file|folder) named "([^"]+)" in the gallery$/
     * @param string $name
     */
    public function stepISelectGalleryItem($name)
    {
        $item = $this->getGalleryItem($name);
        Assert::assertNotNull($item, "File named $name could not be found");
        $item->click();
    }

    /**
     * Check the checkbox for a given gallery item
     * @Given /^I check the (?:file|folder) named "([^"]+)" in the gallery$/
     * @param string $name
     */
    public function stepICheckTheGalleryItem($name)
    {
        $item = $this->getGalleryItem($name);
        Assert::assertNotNull($item, "File named $name could not be found");
        $page = $this->getMainContext()->getSession()->getPage();
        if ($page->find('css', '.gallery__table')) {
            // On the table view we fake a checkbox, because the actual row is responsible for handling
            // events and the screenreader doesn't need a semantic HTML checkbox.
            $item = $item->find('xpath', "/ancestor-or-self::tr[contains(@class, 'gallery__table-row')]");
            Assert::assertNotNull($item, "Correct ancestor element for file named {$name} not found - unexpected markup detected");
            // One of the children should have this error class
            $selectCell = $item->find('css', '.gallery__table-column--select');
            Assert::assertNotNull($selectCell, "Could not find select cell for file named {$name}");
            $selectCell->click();
        } else {
            $checkboxLabel = $item->find('css', 'label.gallery-item__checkbox-label:not(.gallery-item__checkbox-label--disabled)');
            Assert::assertNotNull($checkboxLabel, "Could not find checkbox label for file named {$name}");
            $checkboxLabel->click();
        }
    }

    /**
     * @Then /^I should see the (?:file|folder) named "([^"]+)" in the gallery$/
     * @param string $name
     */
    public function iShouldSeeTheGalleryItem($name)
    {
        $item = $this->getGalleryItem($name);
        Assert::assertNotNull($item, "File named {$name} could not be found");
    }

    /**
     * @Then /^I should not see the file named "([^"]+)" in the gallery$/
     * @param string $name
     */
    public function iShouldNotSeeTheGalleryItem($name)
    {
        $item = $this->getGalleryItem($name, 0);
        Assert::assertNull($item, "File named {$name} was found when it should not be visible");
    }

    /**
     * @Then /^I should (not |)see the "([^"]*)" form$/
     * @param string $id HTML ID of form
     * @param integer $timeout
     */
    public function iShouldSeeTheForm($not, $id, $timeout = 3)
    {
        /** @var DocumentElement $page */
        $page = $this->getMainContext()->getSession()->getPage();
        $form = $this->retryThrowable(function () use ($page, $id) {
            return $page->find('css', "form#{$id}");
        }, $timeout);
        if ($not) {
            Assert::assertNull($form, "form with id $id was present when it should not be");
        } else {
            Assert::assertNotNull($form, "form with id $id could not be found");
            Assert::assertTrue($form->isVisible(), "form with id $id is not visible");
        }
    }

    /**
     * @Then /^I should see the file status flag$/
     */
    public function iShouldSeeTheFileStatusFlag()
    {
        $this->getMainContext()->getSession()->wait(
            1000,
            "window.jQuery && window.jQuery('.editor__status-flag').length > 0"
        );

        $page = $this->getMainContext()->getSession()->getPage();
        $flag = $page->find('css', '.editor__status-flag');
        Assert::assertNotNull($flag, "File editor status flag could not be found");
        Assert::assertTrue($flag->isVisible(), "File status flag is not visible");
    }

    /**
     * @Then /^I should not see the file status flag$/
     */
    public function iShouldNotSeeTheFileStatusFlag()
    {
        $page = $this->getMainContext()->getSession()->getPage();
        $flag = $page->find('css', '.editor__status-flag');
        Assert::assertNull($flag, "File editor status flag should not be present");
    }

    /**
     * @Then /^I should see a file status icon with the class "([^"]*)"/
     * @param string $id HTML ID of form
     */
    public function iShouldSeeTheFileStatusIconWithTheClass($class)
    {
        $js = "window.jQuery && window.jQuery('.file-status-icon__icon').length > 0";
        $this->getMainContext()->getSession()->wait(1000, $js);
        $icon = $this->getMainContext()->getSession()->getPage()->find('css', "{$class}.file-status-icon__icon");
        Assert::assertNotNull($icon, "File status icon '$class' could not be found");
        Assert::assertTrue($icon->isVisible(), "File status icon '$class' is not visible");
    }

    /**
     * @Then /^I should not see a file status icon with the class "([^"]*)"/
     * @param string $id HTML ID of form
     */
    public function iShouldNotSeeTheFileStatusIconWithTheClass($id)
    {
        $this->getMainContext()->getSession()->wait(2500);
        $icon = $this->getMainContext()->getSession()->getPage()->find('css', "{$id}.file-status-icon");
        Assert::assertNull($icon, "File status icon '$id' was found");
    }


    /**
     * @Given /^I click on the breadcrumb link "([^"]+)"$/
     * @param string $name
     */
    public function stepIClickBreadcrumbLink($name)
    {
        $link = $this->getBreadcrumbLink($name);
        Assert::assertNotNull($link, "Breadcrumb link named '$name' could not be found");
        $link->click();
    }

    /**
     * @Then /^I should see the breadcrumb link "([^"]*)"/
     * @param string $name
     */
    public function iShouldSeeTheBreadcrumbLink($name)
    {
        $link = $this->getBreadcrumbLink($name);
        Assert::assertNotNull($link, "Breadcrumb link named '$name' could not be found");
    }

    /**
     * @Then /^I should not see the breadcrumb link "([^"]*)"/
     * @param string $name
     */
    public function iShouldNotSeeTheBreadcrumbLink($name)
    {
        $link = $this->getBreadcrumbLink($name);
        Assert::assertNull($link, "Breadcrumb link named '$name' was found when it should not be visible");
    }

    /**
     * @Given /^I click on the latest history item$/
     */
    public function iClickOnTheLatestHistoryItem()
    {
        $this->getMainContext()->getSession()->wait(
            5000,
            "window.jQuery && window.jQuery('.history-list__list li').length > 0"
        );

        $page = $this->getMainContext()->getSession()->getPage();

        $elements = $page->find('css', '.history-list__list li');

        if (null === $elements) {
            throw new \InvalidArgumentException(sprintf('Could not find list item'));
        }

        $elements->click();
    }

    /**
     * @Given /^I attach the file "([^"]*)" to dropzone "([^"]*)"$/
     * @see MinkContext::attachFileToField()
     * @param string $path
     * @param string $name
     */
    public function iAttachTheFileToDropzone($path, $name)
    {
        // Get path
        $filesPath = $this->getFilesPath();
        if ($filesPath) {
            $fullPath = rtrim(realpath($filesPath ?? '') ?? '', DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.$path;
            if (is_file($fullPath ?? '')) {
                $path = $fullPath;
            }
        }

        Assert::assertFileExists($path, "$path does not exist");
        // Find field
        $selector = "input[type=\"file\"].dz-hidden-input.dz-input-{$name}";

        /** @var DocumentElement $page */
        $page = $this->getMainContext()->getSession()->getPage();
        $input = $page->find('css', $selector);
        Assert::assertNotNull($input, "Could not find {$selector}");

        // Make visible temporarily while attaching
        $this->getMainContext()->getSession()->executeScript(
            <<<EOS
window.jQuery('.dz-hidden-input')
    .css('visibility', 'visible')
    .width(1)
    .height(1);
EOS
        );

        assert($input->isVisible());
        // Attach via html5
        $input->attachFile($path);
    }

    /**
     * @Then I should see an error message on the file :file
     * @param string $file
     */
    public function iShouldSeeAnErrorMessageOnTheFile($file)
    {
        $fileNode = $this->getGalleryItem($file)?->getParent();
        $page = $this->getMainContext()->getSession()->getPage();
        if ($page->find('css', '.gallery__table')) {
            // In table view we're actually getting an element nested fairly low down
            // so we need to ensure the xpath brings us back to the actual tr element
            $fileNode = $fileNode->find('xpath', "/ancestor-or-self::tr[contains(@class, 'gallery__table-row')]");
            // One of the children should have this error class
            Assert::assertNotNull($fileNode->find('css', '.gallery__table-image--error'));
        } else {
            // In gallery view the gallery item itself should have this error class
            Assert::assertTrue($fileNode->hasClass('gallery-item--error'));
        }
    }

    /**
     * Checks that the message box contains specified text.
     *
     * @Then /^I should see "(?P<text>(?:[^"]|\\")*)" in the message box$/
     * @param string $text
     */
    public function assertMessageBoxContainsText($text)
    {
        /** @var FeatureContext $mainContext */
        $mainContext = $this->getMainContext();
        $mainContext
            ->assertSession()
            ->elementTextContains('css', '.message-box', str_replace('\\"', '"', $text ?? ''));
    }

    /**
     * Helper for finding items in the visible gallery view
     *
     * @param string $name Title of item
     * @param int $timeout
     * @return NodeElement
     */
    protected function getGalleryItem($name, $timeout = 3)
    {
        /** @var DocumentElement $page */
        $page = $this->getMainContext()->getSession()->getPage();
        // Find by cell
        $cell = $page->find(
            'xpath',
            "//div[contains(@class, 'gallery-item')]//div[contains(text(), '{$name}')]"
        );
        if ($cell) {
            return $cell;
        }
        // Find by row
        $row = $page->find(
            'xpath',
            "//tr[contains(@class, 'gallery__table-row')]//div//span[contains(text(), '{$name}')]"
        );
        if ($row) {
            return $row;
        }
        return null;
    }

    /**
     * Helper for finding breadcrumb links
     *
     * @param string $name Title of item
     * @return NodeElement
     */
    protected function getBreadcrumbLink(string $name): ?NodeElement
    {
        /** @var DocumentElement $page */
        $page = $this->getMainContext()->getSession()->getPage();
        $link = $page->find(
            'xpath',
            "//li[contains(@class, 'breadcrumb__item')]//a[contains(@class, 'breadcrumb__item-title')][text()='$name']"
        );
        return $link;
    }

    /**
     * Helper for finding items in the visible table gallery view by its order
     *
     * @param string $rank index of the item to get starting at 1
     * @return NodeElement
     */
    protected function getTableGalleryFolderByRank(string $rank)
    {
        /** @var DocumentElement $page */
        $page = $this->getMainContext()->getSession()->getPage();
        // Find by cell - folders
        $cell = $page->find(
            'xpath',
            "//div[contains(@class, 'gallery__folders')]/div[$rank]"
        );
        if ($cell) {
            return $cell;
        }
        return null;
    }

    /**
     * Helper for finding items in the visible gallery view by its order
     *
     * Note: this does not find folders in table view - use getTableGalleryFolderByRank() for that
     *
     * @param string $rank index of the item to get starting at 1
     * @param int $timeout
     * @return NodeElement
     */
    protected function getGalleryItemByRank($rank, $timeout = 3)
    {
        /** @var DocumentElement $page */
        $page = $this->getMainContext()->getSession()->getPage();
        // Find by cell - table view
        $cell = $page->find(
            'xpath',
            "//div[contains(@class, 'gallery__files')]/div[$rank]"
        );
        if ($cell) {
            return $cell;
        }
        // Find by row - list view
        $row = $page->find(
            'xpath',
            "//tr[contains(@class, 'gallery__table-row')][$rank]"
        );
        if ($row) {
            return $row;
        }
        return null;
    }

    /**
     * @Given /^a page "([^"]*)" containing an image "([^"]*)"$/
     * @param string $page
     * @param string $image
     */
    public function aPageContaining($page, $image)
    {
        // Find or create named image
        $fields = $this->prepareFixture(Image::class, $image);
        /** @var Image $image */
        $image = $this->fixtureFactory->createObject(Image::class, $image, $fields);

        // Create page
        $fields = $this->prepareFixture(Page::class, $page);
        $fields = array_merge($fields, [
            'Title' => $page,
            'Content' => sprintf(
                '<p>[image id="%d" width="%d" height="%d"]</p>',
                $image->ID,
                $image->getWidth(),
                $image->getHeight()
            ),
        ]);
        $this->fixtureFactory->createObject(Page::class, $page, $fields);
    }

    /**
     * @Then /^I should (not |)see a modal titled "([^"]*)"$/
     * @param string $title
     */
    public function iShouldSeeAModalTitled($not, $title)
    {
        $page = $this->getMainContext()->getSession()->getPage();
        $modalTitle = $page->find('css', '[role=dialog] .modal-header > .modal-title');
        if ($not) {
            if ($modalTitle && $modalTitle->getText() == $title) {
                // Modal found, but should not be visible
                Assert::assertFalse($modalTitle->isVisible());
            } else {
                // Modal not found, which is also a pass
                Assert::assertTrue(true);
            }
        } else {
            // Modal should be visible and have the correct title
            Assert::assertTrue($modalTitle->getText() == $title);
            Assert::assertTrue($modalTitle->isVisible());
        }
    }

    /**
     * @Then I press the :buttonName button inside the modal
     * @param string $buttonName
     */
    public function iPressButtonInModal($buttonName)
    {
        $page = $this->getMainContext()->getSession()->getPage();
        $modal = $page->find('css', '[role=dialog] .modal-dialog');
        Assert::assertNotNull($modal, 'No modal on the page');

        $button = $this->basicContext->findNamedButton($buttonName, $modal);
        if (!$button) {
            Assert::assertNotNull($button, sprintf('Could not find button labelled "%s"', $buttonName));
        }
        $button->click();
    }

    /**
     * @Then /^I should see the gallery item "([^"]+)" in position "([^"]+)"$/
     * @param string $name
     * @param string $position
     */
    public function iShouldSeeTheGalleryItemInPosition($name, $position)
    {
        $itemByPosition = $this->getGalleryItemByRank($position);
        Assert::assertNotNull($itemByPosition, 'Should have found a gallery item at position ' . $position);
        $title = $itemByPosition->find(
            'xpath',
            "//div[contains(text(), '{$name}')]"
        ) ?: $itemByPosition->find(
            'xpath',
            "//div//span[contains(text(), '{$name}')]"
        );
        Assert::assertNotNull($title, sprintf('File at position %s should be named %s, found %s', $position, $name, $itemByPosition->getText()));
    }

    /**
     * @Then /^I should see the table gallery folder "([^"]+)" in position "([^"]+)"$/
     * @param string $name
     * @param string $position
     */
    public function iShouldSeeTheTableGalleryFolderInPosition(string $name, string $position)
    {
        $folderByPosition = $this->getTableGalleryFolderByRank($position);
        Assert::assertNotNull($folderByPosition, 'Should have found a gallery folder at position ' . $position);
        $title = $folderByPosition->find(
            'xpath',
            "//div[contains(text(), '{$name}')]"
        );
        Assert::assertNotNull($title, sprintf('Folder at position %s should be named %s', $position, $name));
    }

    /**
     * Selects the first media embed match in the HTML editor (tinymce)
     *
     * @When /^I select the media "([^"]+)" in the "([^"]+)" HTML field$/
     */
    public function iSelectTheMediaInHtmlField(string $url, string $field)
    {
        $this->selectInTheHtmlField("div.embed[data-url='$url']", $field);
    }

    /**
     * @When /^I scroll the editor details panel to the top$/
     */
    public function iScrollTheEditorDetailsPanelToTheTop()
    {
        $script = "document.querySelector('.editor__details fieldset').scrollTo(0, 0);";
        $this->getMainContext()->getSession()->executeScript($script);
    }

    /**
     * Example: Given the maximum file size is 5k
     *
     * @Given /^the maximum file size is "([^"]+)"$/
     * @param string $size Max file size
     */
    public function stepCreateMaximumFileSizeStep($size): void
    {
        $config = <<<YAML
        ---
        name: fileallowedsize
        ---

        SilverStripe\Assets\Upload_Validator:
            default_max_file_size:
                '*': $size
        YAML;

        $file = 'file-allowed-size.yml';
        $path = $this->getDestinationConfigFolder($file);
        file_put_contents($path, $config);

        $this->activatedConfigFiles[] = $path;
        $this->getMainContext()->visit('dev/build?flush');
    }

    /**
     * Example: When I drag the file named "file1" to the folder "my folder"
     *
     * @When /^I drag the (?:file|folder) named "([^"]+)" to the folder "([^"]+)"$/
     */
    public function stepDragTheFileToTheFolder(string $fileName, string $folderName): void
    {
        $file = $this->getGalleryItem($fileName)->find('xpath', "/ancestor-or-self::div[contains(@class, 'gallery-item__draggable')]");
        Assert::assertNotNull($file, "File named {$fileName} could not be found or isn't draggable");
        $folder = $this->getGalleryItem($folderName)->find('xpath', "/ancestor-or-self::div[contains(@class, 'gallery-item__droppable')]");
        Assert::assertNotNull($folder, "Folder named {$folderName} could not be found or isn't droppable");
        $file->dragTo($folder);
    }

    /**
     * Example: When I drag the folder "my folder" to the back button"
     *
     * @When /^I drag the (?:file|folder) named "([^"]+)" to the back button$/
     */
    public function stepDragTheFileToTheBackButton(string $fileName): void
    {
        $file = $this->getGalleryItem($fileName)->find('xpath', "/ancestor-or-self::div[contains(@class, 'gallery-item__draggable')]");
        Assert::assertNotNull($file, "File named {$fileName} could not be found or isn't draggable");
        $page = $this->getMainContext()->getSession()->getPage();
        $backButton = $page->find('css', '.gallery__back-container .gallery-item__droppable');
        Assert::assertNotNull($backButton, 'Back button could not be found');
        $file->dragTo($backButton);
    }

    /**
     * Example: Then the file named "file1" should have focus
     *
     * @Then /^the (?:file|folder) named "([^"]+)" should (not |)have focus$/
     */
    public function theItemShouldHaveFocus(string $name, string|bool $not): void
    {
        $file = $this->getGalleryItem($name)?->getParent();
        Assert::assertNotNull($file, "File named {$name} could not be found");
        // In table view we're actually getting an element nested fairly low down
        // so we need to ensure the xpath brings us back to the actual tr element
        if (!$file->hasClass('gallery-item')) {
            $file = $file->find('xpath', "/ancestor-or-self::tr[contains(@class, 'gallery__table-row')]");
            Assert::assertNotNull($file, "File named {$name} was found, but the markup of its parent seems to have changed");
        }
        $this->elementShouldHaveFocus($file, $not);
    }

    /**
     * Check if a specific cell has focus in table/list view. Does not work in gallery/tile view.
     * Example: Then the "Title" column for the file named "file1" should have focus
     *
     * @Then /^the "([^"]+)" column for the (?:file|folder) named "([^"]+)" should (not |)have focus$/
     */
    public function theCellShouldHaveFocus(string $column, string $name, string|bool $not): void
    {
        $page = $this->getMainContext()->getSession()->getPage();
        Assert::assertNotNull($page->find('css', '.gallery__table'), 'Cannot focus on columns outside of table view');
        $file = $this->getGalleryItem($name)?->find('xpath', "/ancestor-or-self::tr[contains(@class, 'gallery__table-row')]");
        Assert::assertNotNull($file, "File named {$name} could not be found");
        $cell = $file->find('css', '.gallery__table-column--' . strtolower($column));
        Assert::assertNotNull($cell, "Column named {$column} could not be found for file named {$name}");
        $this->elementShouldHaveFocus($cell, $not);
    }

    /**
     * Assert that a given element should (or shouldn't) have focus.
     */
    private function elementShouldHaveFocus(NodeElement $element, string|bool $not): void
    {
        $xpath = $element->getXpath();
        $not = $not ? 'true' : 'false';
        $script = <<<JS
            return (function() {
                var el = document.evaluate("$xpath", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (!el) {
                    return false;
                }
                return ($not) ? el !== document.activeElement : el === document.activeElement;
            })();
        JS;
        $context = $this->getMainContext();
        $res = $context->getSession()->evaluateScript($script);
        Assert::assertTrue($res);
    }
}

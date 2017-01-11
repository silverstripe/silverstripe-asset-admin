<?php

namespace SilverStripe\AssetAdmin\Tests\Behat\Context;

use Behat\Mink\Element\DocumentElement;
use Behat\Mink\Element\NodeElement;
use SilverStripe\BehatExtension\Context\FixtureContext as BaseFixtureContext;

/**
 * Context used to create fixtures in the SilverStripe ORM.
 */
class FixtureContext extends BaseFixtureContext
{

    /**
     * Select a gallery item by type and name
     *
     * @Given /^I (?:(?:click on)|(?:select)) the file named "([^"]+)" in the gallery$/
     * @param string $name
     */
    public function stepISelectGalleryItem($name)
    {
        $item = $this->getGalleryItem($name);
        assertNotNull($item, "File named $name could not be found");
        $item->click();
    }

    /**
     * Check the checkbox for a given gallery item
     * @Given /^I check the file named "([^"]+)" in the gallery$/
     * @param string $name
     */
    public function stepICheckTheGalleryItem($name)
    {
        $item = $this->getGalleryItem($name);
        assertNotNull($item, "File named $name could not be found");
        $checkbox = $item->find('css', 'input[type="checkbox"]');
        assertNotNull($checkbox, "Could not find checkbox for file named {$name}");
        $checkbox->check();
    }

    /**
     * @Then /^I should see the file named "([^"]+)" in the gallery$/
     * @param string $name
     */
    public function iShouldSeeTheGalleryItem($name)
    {
        $item = $this->getGalleryItem($name);
        assertNotNull($item, "File named {$name} could not be found");
    }

    /**
     * @Then /^I should not see the file named "([^"]+)" in the gallery$/
     * @param string $name
     */
    public function iShouldNotSeeTheGalleryItem($name)
    {
        $item = $this->getGalleryItem($name, 0);
        assertNull($item, "File named {$name} was found when it should not be visible");
    }

    /**
     * @Then /^I should see the "([^"]*)" form$/
     * @param string $id HTML ID of form
     */
    public function iShouldSeeTheForm($id)
    {
        /** @var DocumentElement $page */
        $page = $this->getSession()->getPage();
        $form = $this->retry(function () use ($page, $id) {
            return $page->find('css', "form#{$id}");
        });
        assertNotNull($form, "form with id $id could not be found");
        assertTrue($form->isVisible(), "form with id $id is not visible");
    }

    /**
     * @Given /^I click on the latest history item$/
     */
    public function iClickOnTheLatestHistoryItem()
    {
        $this->getSession()->wait(
            5000,
            "window.jQuery && window.jQuery('.file-history__list li').size() > 0"
        );

        $page = $this->getSession()->getPage();

        $elements = $page->find('css', '.file-history__list li');

        if (null === $elements) {
            throw new \InvalidArgumentException(sprintf('Could not find list item'));
        }

        $elements->click();
    }

    /**
     * @Given /^I attach the file "([^"]*)" to dropzone "([^"]*)"$/
     * @see MinkContext::attachFileToField()
     */
    public function iAttachTheFileToDropzone($path, $name)
    {
        // Get path
        $filesPath = $this->getMainContext()->getMinkParameter('files_path');
        if ($filesPath) {
            $fullPath = rtrim(realpath($filesPath), DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.$path;
            if (is_file($fullPath)) {
                $path = $fullPath;
            }
        }

        assertFileExists($path, "$path does not exist");
        // Find field
        $selector = "input[type=\"file\"].dz-hidden-input.dz-input-{$name}";

        /** @var DocumentElement $page */
        $page = $this->getSession()->getPage();
        $input = $page->find('css', $selector);
        assertNotNull($input, "Could not find {$selector}");

        // Make visible temporarily while attaching
        $this->getSession()->executeScript(
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
     * Checks that the message box contains specified text.
     *
     * @Then /^I should see "(?P<text>(?:[^"]|\\")*)" in the message box$/
     */
    public function assertMessageBoxContainsText($text)
    {
        $this->assertSession()->elementTextContains('css', '.message-box', $this->fixStepArgument($text));
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
        $page = $this->getSession()->getPage();
        return $this->retry(function () use ($page, $name) {
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
                "//tr[contains(@class, 'gallery__table-row')]//div[contains(text(), '{$name}')]"
            );
            if ($row) {
                return $row;
            }
            return null;
        }, $timeout);
    }

    /**
     * Invoke $try callback for a non-empty result with a given timeout
     *
     * @param callable $try
     * @param int $timeout Number of seconds to retry for
     * @return mixed Result of invoking $try, or null if timed out
     */
    protected function retry($try, $timeout = 3)
    {
        do {
            $result = $try();
            if ($result) {
                return $result;
            }
            sleep(1);
        } while (--$timeout >= 0);
        return null;
    }
}

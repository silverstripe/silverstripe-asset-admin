<?php

namespace SilverStripe\AssetAdmin\Tests\Behat\Context;

use SilverStripe\BehatExtension\Context\FixtureContext as BaseFixtureContext;

/**
 * Context used to create fixtures in the SilverStripe ORM.
 */
class FixtureContext extends BaseFixtureContext
{

    /**
     * Select a gallery item by type and name
     *
     * @Given /^I (?:(?:click on)|(?:select)) the "([^"]+)" named "([^"]+)" in the gallery$/
     * @param string $type
     * @param string $name
     */
    public function stepISelectGalleryItem($type, $name)
    {
        $page = $this->getSession()->getPage();
        $gallery = $page->find(
            'xpath',
            "//div[contains(@class, 'gallery-item--{$type}')]//div[contains(text(), '{$name}')]"
        );
        assertNotNull($gallery, ucfirst($type) . " named $name could not be found");
        $gallery->click();
    }

    /**
     * @Then /^I should see the "([^"]*)" form$/
     * @param string $id HTML ID of form
     */
    public function iShouldSeeTheForm($id)
    {
        $page = $this->getSession()->getPage();
        $form = $page->find('css', "form#{$id}");
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
}

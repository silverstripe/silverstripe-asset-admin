<?php

namespace SilverStripe\AssetAdmin\Tests\Behat\Context;

use SilverStripe\Framework\Test\Behaviour\FeatureContext as BaseFeatureContext;

class FeatureContext extends BaseFeatureContext
{
	/**
	 * Initializes context.
	 * Every scenario gets it's own context object.
	 *
	 * @param array $parameters Context parameters (set them up through behat.yml)
	 */
	public function __construct(array $parameters) {
		parent::__construct($parameters);

		// Override existing fixture context with more specific one
		$fixtureContext = new FixtureContext($parameters);
		$fixtureContext->setFixtureFactory($this->getFixtureFactory());
		$this->useContext('FixtureContext', $fixtureContext);
	}

    /**
     * @Then /^I should see a history list$/
     */
    public function iShouldSeeAHistoryList()
    {
        $page = $this->getSession()->getPage();

        $form = $page->find('css', '.file-history__list');
        assertNotNull($form, 'I should see a history list');
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
     * @Then /^I should see the history form$/
     */
    public function iShouldSeeTheHistoryForm()
    {
        $this->getSession()->wait(
            5000,
            "window.jQuery && window.jQuery('#Form_FileHistoryForm').size() > 0"
        );

        $page = $this->getSession()->getPage();

        $form = $page->find('css', '#Form_FileHistoryForm');
        assertNotNull($form, 'I should see a history list');
    }

    /**
     * @Then /^the latest history item should contain "([^"]*)"$/
     */
    public function theLatestHistoryItemShouldContain($arg1)
    {
        $page = $this->getSession()->getPage();

        $element = $page->find('css', '.file-history__list li');

        if (null === $element) {
            throw new \InvalidArgumentException(sprintf('Could not find list item'));
        }

        foreach($element as $li) {
            $text = $element[0]->getText();

            assertElementContains($element, $arg1);

            break;
        }
    }

    /**
     * @When /^I click the "([^"]*)" tab$/
     */
    public function iClickTheTab($tab) {
        $this->getSession()->wait(
            5000,
            "window.jQuery && window.jQuery('.nav-tabs').size() > 0"
        );

        $page = $this->getSession()->getPage();
        $tabsets = $page->findAll('css', '.nav-tabs');
        assertNotNull($tabsets, 'CMS tabs not found');

        $tab_element = null;
        foreach($tabsets as $tabset) {
            if($tab_element) continue;
            $tab_element = $tabset->find('named', array('link_or_button', "'$tab'"));
        }
        assertNotNull($tab_element, sprintf('%s tab not found', $tab));

        $tab_element->click();
    }
}

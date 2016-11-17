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
}

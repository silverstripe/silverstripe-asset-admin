<?php

namespace SilverStripe\AssetAdmin\Tests\Forms;

use SilverStripe\AssetAdmin\Exceptions\InvalidRemoteUrlException;
use SilverStripe\AssetAdmin\Forms\RemoteFileFormFactory;
use SilverStripe\AssetAdmin\Tests\Forms\RemoteFileFormFactoryTest\MockEmbed;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Forms\Form;
use SilverStripe\View\Embed\Embeddable;
use PHPUnit\Framework\Attributes\DataProvider;

class RemoteFileFormFactoryTest extends SapphireTest
{

    protected function setUp(): void
    {
        parent::setUp();

        // Reset all configs
        RemoteFileFormFactory::config()->set('fileurl_scheme_whitelist', []);
        RemoteFileFormFactory::config()->set('fileurl_scheme_blacklist', []);
        RemoteFileFormFactory::config()->set('fileurl_port_whitelist', []);
        RemoteFileFormFactory::config()->set('fileurl_port_blacklist', []);
        RemoteFileFormFactory::config()->set('fileurl_domain_whitelist', []);
        RemoteFileFormFactory::config()->set('fileurl_domain_blacklist', []);

        // mock embed
        Injector::inst()->load([
            Embeddable::class => [
                'class' => MockEmbed::class,
            ]
        ]);
    }

    public static function providerTestAcceptedURLs()
    {
        return [
            [
                ['fileurl_scheme_blacklist' => ['https']],
                'http://www.google.com',
            ],
            [
                ['fileurl_scheme_whitelist' => ['http']],
                'http://www.google.com',
            ],
            [
                ['fileurl_domain_blacklist' => ['www.amazon.com']],
                'http://www.google.com',
            ],
            [
                ['fileurl_domain_whitelist' => ['www.google.com']],
                'http://www.google.com',
            ],
            [
                # port-ommitted urls ignored. Needs schema blacklist also
                ['fileurl_port_blacklist' => [80]],
                'http://www.google.com',
            ],
            [
                # port-ommitted urls ignored
                ['fileurl_port_whitelist' => [80]],
                'http://www.google.com',
            ],
            [
                ['fileurl_port_blacklist' => [443]],
                'http://www.google.com:80',
            ],
            [
                ['fileurl_port_whitelist' => [443]],
                'https://www.google.com:443',
            ],
        ];
    }

    /**
     * @param array $config Config to merge
     * @param string $acceptedURL OK url
     */
    #[DataProvider('providerTestAcceptedURLs')]
    public function testAcceptedURLs($config, $acceptedURL)
    {
        foreach ($config as $key => $value) {
            RemoteFileFormFactory::config()->set($key, $value);
        }

        // Should pass
        $builder = new RemoteFileFormFactory();
        $fields = $builder->getForm(null, 'Form', [
            'type' => 'edit',
            'url' => $acceptedURL,
        ]);
        $this->assertInstanceOf(Form::class, $fields);
    }

    public static function providerTestRejectedURLs()
    {
        return [
            [
                ['fileurl_scheme_blacklist' => ['https']],
                'https://www.google.com'
            ],
            [
                ['fileurl_scheme_whitelist' => ['http']],
                'https://www.google.com'
            ],
            [
                ['fileurl_domain_blacklist' => ['www.amazon.com']],
                'http://www.amazon.com'
            ],
            [
                ['fileurl_domain_whitelist' => ['www.google.com']],
                'http://www.amazon.com'
            ],
            [
                # ipv4 blacklist
                ['fileurl_domain_blacklist' => ['127.0.0.1']],
                'http://127.0.0.1/'
            ],
            [
                # ipv6 blacklist
                ['fileurl_domain_blacklist' => ['[0:0:0:0:0:0:0:1]']],
                'http://[0:0:0:0:0:0:0:1]/'
            ],
            [
                # ipv6 blacklist
                ['fileurl_domain_blacklist' => ['[::1]']],
                'http://[::1]/'
            ],
            [
                ['fileurl_port_blacklist' => [80]],
                'http://www.google.com:80'
            ],
            [
                # port-ommitted urls ignored
                ['fileurl_port_whitelist' => [80]],
                'http://www.google.com:443'
            ],
        ];
    }

    /**
     * @param array $config Config to merge
     * @param string $rejectedURL rejected url
     * @param string $rejectedMessage
     */
    #[DataProvider('providerTestRejectedURLs')]
    public function testRejectedURLS($config, $rejectedURL)
    {
        $this->expectException(InvalidRemoteUrlException::class);

        // Set config
        foreach ($config as $key => $value) {
            RemoteFileFormFactory::config()->set($key, $value);
        }

        // Should throw error
        $builder = new RemoteFileFormFactory();
        $builder->getForm(null, 'Form', [
            'type' => 'edit',
            'url' => $rejectedURL,
        ]);
    }
}

<?php

namespace SilverStripe\AssetAdmin\Tests\Model;

use Embed\Http\DispatcherInterface;
use Embed\Http\Response;
use Embed\Http\Url;
use SilverStripe\AssetAdmin\Model\EmbedResource;
use SilverStripe\Dev\SapphireTest;

/**
 * Class EmbedResourceTest
 *
 * @package SilverStripe\AssetAdmin\Tests\Model
 */
class EmbedResourceTest extends SapphireTest
{
    /**
     * Make sure EmbedResource can accept a dispatcher
     */
    public function testEmbedResource(){

        // Stub the dispatcher object so we don't have to make a connection to youtube,
        // we only want to check the  dispatcher is set correctly.
        $title = "Try to stay SERIOUS -The most popular CAT videos";
        $url = "https://www.youtube.com/watch?v=iRXJXaLV0n4";

        $stub = $this->createMock("Embed\Http\CurlDispatcher");
        $stub->method("dispatch")->will($this->returnValue($this->mockResponse()));

        $this->assertInstanceOf(DispatcherInterface::class, $stub);

        // New function to overload the dispatcher.
        EmbedResource::setDispatcher($stub);

        $res = new EmbedResource($url);
        $this->assertSame($title, $res->getName());
    }

    /**
     * Generate a mock Response object suitable for Embed
     *
     * @return Response
     */
    private function mockResponse(){

        $url = Url::create('https://www.youtube.com/watch?v=iRXJXaLV0n4');
        return new Response(
            $url,
            $url,
            200,
            'application/json',
            '{"author_url":"https:\\/\\/www.youtube.com\\/channel\\/UCR2KG2dK1tAkwZZjm7rAiSg","thumbnail_width":480,"title":"Try to stay SERIOUS -The most popular CAT videos","width":480,"provider_name":"YouTube","author_name":"Tiger Funnies","height":270,"version":"1.0","type":"video","html":"\\u003ciframe width=\\"480\\" height=\\"270\\" src=\\"https:\\/\\/www.youtube.com\\/embed\\/iRXJXaLV0n4?feature=oembed\\" frameborder=\\"0\\" allow=\\"autoplay; encrypted-media\\" allowfullscreen\\u003e\\u003c\\/iframe\\u003e","provider_url":"https:\\/\\/www.youtube.com\\/","thumbnail_height":360,"thumbnail_url":"https:\\/\\/i.ytimg.com\\/vi\\/iRXJXaLV0n4\\/hqdefault.jpg"}',
            []
        );

    }
}

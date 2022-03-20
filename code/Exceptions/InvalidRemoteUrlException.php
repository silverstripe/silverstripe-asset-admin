<?php

namespace SilverStripe\AssetAdmin\Exceptions;

use Exception;

/**
 * This exception is thrown by RemoteFileFormFactory when failing to fetch an
 * embeddable remote resource because it's either an invalid URL or because
 * the resource is invalid
 */
class InvalidRemoteUrlException extends Exception
{
}

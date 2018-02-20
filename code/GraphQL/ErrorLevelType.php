<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use GraphQL\Type\Definition\EnumType;
use SilverStripe\GraphQL\TypeCreator;
use Psr\Log\LogLevel;

class ErrorLevelType extends TypeCreator
{
    /**
     * @var array
     */
    private static $levels = [
        LogLevel::ALERT,
        LogLevel::CRITICAL,
        LogLevel::DEBUG,
        LogLevel::EMERGENCY,
        LogLevel::ERROR,
        LogLevel::INFO,
        LogLevel::NOTICE,
        LogLevel::WARNING,
    ];

    /**
     * @return EnumType
     */
    public function toType()
    {
        return new EnumType([
            'name' => 'ErrorLevel',
            'description' => 'The severity of the error',
            'values' => array_map(function ($level) {
                return [
                    'name' => strtoupper($level),
                    'value' => $level,
                ];
            }, static::$levels),
        ]);
    }
}

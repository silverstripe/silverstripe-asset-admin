<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use Psr\Log\LogLevel;

class OperationError
{
    /**
     * @var string
     */
    protected $type;

    /**
     * @var string
     */
    protected $level;

    /**
     * @var array
     */
    protected $ids = [];

    /**
     * @var string
     */
    protected $message;

    /**
     * MutationException constructor.
     * @param string $message
     * @param int $type
     * @param string|\Throwable $level
     * @param array $ids
     */
    public function __construct($message, $type, $level = LogLevel::ERROR, $ids = [])
    {
        $this->message = $message;
        $this->type = $type;
        $this->level = $level;
        $this->ids = $ids;
    }

    /**
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param $type
     * @return $this
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return string
     */
    public function getLevel()
    {
        return $this->level;
    }

    /**
     * @param $level
     * @return $this
     */
    public function setLevel($level)
    {
        $this->level = $level;

        return $this;
    }

    public function getIDs()
    {
        return $this->ids;
    }

    /**
     * @param $ids
     * @return $this
     */
    public function setIDs($ids)
    {
        $this->ids = $ids;

        return $this;
    }

    /**
     * @return string
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * @param string $message
     * @return $this
     */
    public function setMessage($message)
    {
        $this->message = $message;

        return $this;
    }
}

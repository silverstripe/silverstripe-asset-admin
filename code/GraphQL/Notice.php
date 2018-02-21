<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use Psr\Log\LogLevel;

class Notice
{
    /**
     * @var string
     */
    protected $type;

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
     * @param array $ids
     */
    public function __construct($message, $type, $ids = [])
    {
        $this->message = $message;
        $this->type = $type;
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
     * @return array
     */
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

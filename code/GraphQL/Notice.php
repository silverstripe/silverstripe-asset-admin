<?php

namespace SilverStripe\AssetAdmin\GraphQL;

/**
 * Represents a notice related to a graphql Action. This could be a failure,
 * warning, or recoverable query (e.g. "are you sure you want to publish this item?")
 */
class Notice
{
    /**
     * @var string
     */
    protected $type;

    /**
     * IDs of records this notice relateds to
     *
     * @var array
     */
    protected $ids = [];

    /**
     * @var string
     */
    protected $message;

    /**
     * Notice constructor.
     *
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
     * @param string $type
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
     * @param array $ids
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

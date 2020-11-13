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
    protected $noticeType;

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
     * @param int $noticeType
     * @param array $ids
     */
    public function __construct($message, $noticeType, $ids = [])
    {
        $this->message = $message;
        $this->noticeType = $noticeType;
        $this->ids = $ids;
    }

    /**
     * @return string
     */
    public function getNoticeType()
    {
        return $this->noticeType;
    }

    /**
     * @param string $noticeType
     * @return $this
     */
    public function setNoticeType($noticeType)
    {
        $this->noticeType = $noticeType;

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

<?php

namespace SilverStripe\Forms;

use Convert;
use UploadField;
use SS_HTTPRequest;
use SS_HTTPResponse;
use Folder;
use DataObject;

/**
 * Class DropzoneUploadField
 *
 * @todo DropzoneUploadField will eventually become UploadField. Until that refactor happens Dropzone specific behaviour goes here.
 * @package SilverStripe\Forms
 */
class DropzoneUploadField extends UploadField
{

    protected $schemaDataType = 'Hidden';

    /**
     * @var array
     */
    private static $allowed_actions = [
        'uploadFile'
    ];

    private static $url_handlers = [
        'POST upload' => 'uploadFile'
    ];

    public function uploadFile(SS_HTTPRequest $request) {
        $folderID = $request->postVar('folderID');

        if ($folderID == 0) {
            $this->setFolderName('/');
        } else {
            $folderName = Folder::get()->byID($folderID)->Name;
            $this->setFolderName($folderName);
        }

        return $this->upload($request);
    }

    /**
     * This method is identical to `AssetGalleryField::getObjectFromData`.
     * Ideally this would be on File, and be available at some endpoint, similar to the form field schema.
     *
     * @param $file
     *
     * @return array
     */
    protected function getObjectFromData($file)
    {
        $object = [
            'id' => $file->ID,
            'created' => $file->Created,
            'lastUpdated' => $file->LastEdited,
            'owner' => null,
            'parent' => null,
            'attributes' => [
                'dimensions' => [],
            ],
            'title' => $file->Title,
            'type' => $file->is_a('Folder') ? 'folder' : $file->FileType,
            'category' => $file->is_a('Folder') ? 'folder' : $file->appCategory(),
            'basename' => $file->Name,
            'filename' => $file->Filename,
            'extension' => $file->Extension,
            'size' => $file->Size,
            'url' => $file->AbsoluteURL,
            'canEdit' => $file->canEdit(),
            'canDelete' => $file->canDelete()
        ];

        /** @var Member $owner */
        $owner = $file->Owner();

        if ($owner) {
            $object['owner'] = [
                'id' => $owner->ID,
                'title' => trim($owner->FirstName . ' ' . $owner->Surname),
            ];
        }

        /** @var Folder $parent */
        $parent = $file->Parent();

        if ($parent) {
            $object['parent'] = [
                'id' => $parent->ID,
                'title' => $parent->Title,
                'filename' => $parent->Filename,
            ];
        }

        /** @var File $file */
        if ($file->hasMethod('getWidth') && $file->hasMethod('getHeight')) {
            $object['attributes']['dimensions']['width'] = $file->Width;
            $object['attributes']['dimensions']['height'] = $file->Height;
        }

        return $object;
    }

    public function upload(SS_HTTPRequest $request)
    {
        if($this->isDisabled() || $this->isReadonly() || !$this->canUpload()) {
            return $this->httpError(403);
        }

        // Protect against CSRF on destructive action
        $token = $this->getForm()->getSecurityToken();
        if(!$token->checkRequest($request)) return $this->httpError(400);

        // Get form details
        $name = $this->getName();
        $postVars = $request->postVar($name);

        // Extract uploaded files from Form data
        $uploadedFiles = $this->extractUploadedFileData($postVars);
        $return = [];

        // Save the temporary files into a File objects
        // and save data/error on a per file basis
        foreach ($uploadedFiles as $tempFile) {
            $file = $this->saveTemporaryFile($tempFile, $error);
            if(empty($file)) {
                array_push($return, ['error' => $error]);
            } else {
                array_push($return, $this->getObjectFromData($file));
            }
            $this->upload->clearErrors();
        }

        // Format response with json
        $response = new SS_HTTPResponse(Convert::raw2json($return));
        $response->addHeader('Content-Type', 'application/json');
        return $response;
    }

    public function Field($properties = [])
    {
        return '';
    }

    public function FieldHolder($properties = [])
    {
        return '';
    }
}

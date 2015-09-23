<?php

namespace SilverStripe\Forms;

use Controller;
use File;
use Folder;
use FormField;
use Member;
use Requirements;
use SS_HTTPRequest;
use SS_HTTPResponse;

class AssetGalleryField extends FormField {
	/**
	 * @var array
	 */
	private static $allowed_actions = array(
		'files',
	);

	/**
	 * @config
	 *
	 * @var string
	 */
	private static $defaultPath = 'uploads';

	/**
	 * @var string
	 */
	protected $currentPath;

	/**
	 * @return $this
	 */
	public function performReadonlyTransformation() {
		return $this;
	}

	/**
	 * @return string
	 */
	public function Type() {
		return 'asset-gallery';
	}

	/**
	 * @param SS_HTTPRequest $request
	 *
	 * @return SS_HTTPResponse
	 */
	public function files(SS_HTTPRequest $request) {
		$data = $this->getData();

		$response = new SS_HTTPResponse();
		$response->addHeader('Content-Type', 'application/json');
		$response->setBody(json_encode(array('files' => $data)));

		return $response;
	}

	/**
	 * @return array
	 */
	protected function getData() {
		$data = array();

		$folder = $this->getFolder();

		if($folder->hasChildren()) {
			/** @var File[] $files */
			$files = $folder->myChildren();

			foreach($files as $file) {
				$object = array(
					'id' => $file->ID,
					'created' => $file->Created,
					'lastUpdated' => $file->LastEdited,
					'owner' => null,
					'parent' => null,
					'title' => $file->getTitle(),
					'type' => $file->getFileType(),
					'filename' => $file->getFilename(),
					'extension' => $file->getExtension(),
					// @todo
					// 'attributes' => null,
					// 'size' => $file->getSize(),
					// 'url' => $file->getAbsoluteURL(),
				);

				/** @var Member $owner */
				$owner = $file->Owner();

				if($owner) {
					$object['owner'] = array(
						'id' => $owner->ID,
						'title' => trim($owner->FirstName . ' ' . $owner->Surname),
					);
				}

				/** @var Folder $parent */
				$parent = $file->Parent();

				if($parent) {
					$object['parent'] = array(
						'id' => $parent->ID,
						'title' => $parent->getTitle(),
						'path' => $parent->getFilename(),
					);
				}

				$data[] = $object;
			}
		}

		return $data;
	}

	/**
	 * @return Folder
	 */
	protected function getFolder() {
		$path = $this->config()->defaultPath;

		if($this->getCurrentPath()) {
			$path = $this->getCurrentPath();
		}

		return Folder::find_or_make($path);
	}

	/**
	 * @inheritdoc
	 *
	 * @param array $properties
	 *
	 * @return string
	 */
	public function Field($properties = array()) {
		$name = $this->getName();
		$data = json_encode($this->getData());

		Requirements::css(ASSET_GALLERY_FIELD_DIR . "/public/dist/main.css");
		Requirements::javascript(ASSET_GALLERY_FIELD_DIR . "/public/dist/bundle.js");
		Requirements::customScript("var asset_gallery_{$name} = {$data};");

		$url = $this->getFilesURL();

		return "<div class='asset-gallery' data-asset-gallery-name='{$name}' data-asset-gallery-url='{$url}'></div>";
	}

	/**
	 * @return string
	 */
	protected function getFilesURL() {
		return Controller::join_links($this->Link(), 'files');
	}

	/**
	 * @return string
	 */
	public function getCurrentPath() {
		return $this->currentPath;
	}

	/**
	 * @param string $currentPath
	 *
	 * @return $this
	 */
	public function setCurrentPath($currentPath) {
		$this->currentPath = $currentPath;

		return $this;
	}
}

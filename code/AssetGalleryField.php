<?php

namespace SilverStripe\Forms;

use Controller;
use Exception;
use File;
use Folder;
use FormField;
use Member;
use Requirements;
use SS_HTTPRequest;
use SS_HTTPResponse;
use SS_List;

class AssetGalleryField extends FormField {
	/**
	 * @var array
	 */
	private static $allowed_actions = array(
		'data',
		'update',
		'delete',
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
	public function data(SS_HTTPRequest $request) {
		$filters = array();

		if ($name = $request->getVar('name')) {
			$filters['name'] = $name;
		}

		if ($created_from = $request->getVar('created_from')) {
			$filters['created_from'] = $created_from;
		}

		if ($created_to = $request->getVar('created-to')) {
			$filters['created_to'] = $created_to;
		}

		$data = $this->getData($filters);

		$response = new SS_HTTPResponse();
		$response->addHeader('Content-Type', 'application/json');
		$response->setBody(json_encode(array('files' => $data)));

		return $response;
	}

	/**
	 * @param SS_HTTPRequest $request
	 *
	 * @return SS_HTTPResponse
	 */
	public function update(SS_HTTPRequest $request) {
		// TODO

		$response = new SS_HTTPResponse();
		$response->addHeader('Content-Type', 'application/json');
		$response->setBody(json_encode(null));

		return $response;
	}

	/**
	 * @param SS_HTTPRequest $request
	 *
	 * @return SS_HTTPResponse
	 */
	public function delete(SS_HTTPRequest $request) {
		$file = File::get()->filter("id", (int) $request->getVar("id"))->first();

		$response = new SS_HTTPResponse();
		$response->addHeader('Content-Type', 'application/json');

		if ($file) {
			$file->delete();

			$response->setBody(json_encode(array(
				'status' => 'file was deleted',
			)));
		} else {
			$response->setStatusCode(500);

			$response->setBody(json_encode(array(
				'status' => 'could not find the file',
			)));
		}

		return $response;
	}

	/**
	 * @param array $filters
	 *
	 * @return array
	 */
	protected function getData($filters = array()) {
		$data = array();

		$folder = $this->getFolder();

		if($folder->hasChildren()) {
			/** @var File[]|SS_List $files */
			$files = $folder->myChildren();

			if (isset($filters['name'])) {
				$files = $files->filterAny(array(
					'Name:PartialMatch' => $filters['name'],
					'Title:PartialMatch' => $filters['name']
				));
			}

			if(!empty($params['created_from'])) {
				$fromDate = new DateField(null, null, $params['created_from']);
				$files = $files->filter("Created:GreaterThanOrEqual", $fromDate->dataValue().' 00:00:00');
			}

			if(!empty($params['created_to'])) {
				$toDate = new DateField(null, null, $params['created_to']);
				$files = $files->filter("Created:LessThanOrEqual", $toDate->dataValue().' 23:59:59');
			}

			$files = $files->sort(
				'(CASE WHEN "File"."ClassName" = \'Folder\' THEN 0 ELSE 1 END), "Name"'
			);

			foreach($files as $file) {
				$data[] = $this->getObjectFromData($file);
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
		Requirements::customScript("
			window.SS_ASSET_GALLERY = window.SS_ASSET_GALLEY || {};
			window.SS_ASSET_GALLERY['{$name}'] = {$data};
		");

		$dataURL = $this->getDataURL();
		$updateURL = $this->getUpdateURL();
		$deleteURL = $this->getDeleteURL();

		return "<div
			class='asset-gallery'
			data-asset-gallery-name='{$name}'
			data-asset-gallery-data-url='{$dataURL}'
			data-asset-gallery-update-url='{$updateURL}'
			data-asset-gallery-delete-url='{$deleteURL}'
			></div>";
	}

	/**
	 * @return string
	 */
	protected function getDataURL() {
		return Controller::join_links($this->Link(), 'data');
	}

	/**
	 * @return string
	 */
	protected function getUpdateURL() {
		return Controller::join_links($this->Link(), 'update');
	}

	/**
	 * @return string
	 */
	protected function getDeleteURL() {
		return Controller::join_links($this->Link(), 'delete');
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

	/**
	 * @param File $file
	 *
	 * @return array
	 */
	protected function getObjectFromData(File $file) {
		$object = array(
			'id' => $file->ID,
			'created' => $file->Created,
			'lastUpdated' => $file->LastEdited,
			'owner' => null,
			'parent' => null,
			'attributes' => array(
				'dimensions' => array(),
			),
			'title' => $file->getTitle(),
			'type' => $file->getFileType(),
			'filename' => $file->getFilename(),
			'extension' => $file->getExtension(),
			'size' => $file->getSize(),
			'url' => $file->getAbsoluteURL(),
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

		/** @var File $file */
		if($file->hasMethod('getWidth') && $file->hasMethod('getHeight')) {
			$object['attributes']['dimensions']['width'] = $file->getWidth();
			$object['attributes']['dimensions']['height'] = $file->getHeight();
		}

		return $object;
	}
}

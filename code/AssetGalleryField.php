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
	 * @var int
	 */
	protected $limit = 10;

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

		if ($folder = $request->getVar('filter_folder')) {
			$filters['filter_folder'] = $folder;
		}

		if ($name = $request->getVar('filter_name')) {
			$filters['filter_name'] = $name;
		}

		if ($type = $request->getVar('filter_type')) {
			$filters['filter_type'] = $type;
		}

		if ($created_from = $request->getVar('filter_created_from')) {
			$filters['filter_created_from'] = $created_from;
		}

		if ($created_to = $request->getVar('filter_created_to')) {
			$filters['filter_created_to'] = $created_to;
		}

		$filters['page'] = 1;
		$filters['limit'] = 10;

		if ($page = $request->getVar('page')) {
			$filters['page'] = $page;
		}

		if ($limit = $request->getVar('limit')) {
			$filters['limit'] = $limit;
		}

		$data = $this->getData($filters);

		$response = new SS_HTTPResponse();
		$response->addHeader('Content-Type', 'application/json');
		$response->setBody(json_encode(array(
			'files' => $data['items'],
			'count' => $data['count'],
		)));

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
		$items = array();

		$folder = null;

		if (isset($filters['filter_folder'])) {
			$folder = $filters['filter_folder'];
		}

		$folder = $this->getFolder($folder);
		$count = 0;

		if($folder->hasChildren()) {
			/** @var File[]|SS_List $files */
			$files = $folder->myChildren();

			if (isset($filters['filter_name'])) {
				$files = $files->filterAny(array(
					'Name:PartialMatch' => $filters['filter_name'],
					'Title:PartialMatch' => $filters['filter_name']
				));
			}

			if(!empty($params['filter_type']) && !empty(File::config()->app_categories[$params['filter_type']])) {
				$extensions = File::config()->app_categories[$params['filter_type']];
				$files = $files->filter('Name:PartialMatch', $extensions);
			}

			if(!empty($params['filter_created_from'])) {
				$fromDate = new DateField(null, null, $params['filter_created_from']);
				$files = $files->filter("Created:GreaterThanOrEqual", $fromDate->dataValue().' 00:00:00');
			}

			if(!empty($params['filter_created_to'])) {
				$toDate = new DateField(null, null, $params['filter_created_to']);
				$files = $files->filter("Created:LessThanOrEqual", $toDate->dataValue().' 23:59:59');
			}

			$sort = 'Name';
			$direction = 'ASC';

			if (!empty($filters['sort']) && in_array($filters['sort'], array('Name', 'Created', 'Modified'))) {
				$sort = $filters['sort'];
			}

			if (!empty($filters['direction']) && in_array($filters['direction'], array('ASC', 'DESC'))) {
				$direction = $filters['direction'];
			}

			$files = $files->sort(
				'(CASE WHEN "File"."ClassName" = \'Folder\' THEN 0 ELSE 1 END), "' . $sort . '"', $direction
			);

			$count = $files->count();

			if (isset($filters['page']) && isset($filters['limit'])) {
				$page = $filters['page'];
				$limit = $filters['limit'];

				$offset = ($page - 1) * $limit;


				$files = $files->limit($limit, $offset);
			}

			foreach($files as $file) {
				$items[] = $this->getObjectFromData($file);
			}
		}

		return array(
			"items" => $items,
			"count" => $count,
		);
	}

	/**
	 * @param null|string $folder
	 *
	 * @return null|Folder
	 */
	protected function getFolder($folder = null) {
		if ($folder) {
			return Folder::find_or_make($folder);
		}

		$path = null;

		$path = $this->config()->defaultPath;

		if($this->getCurrentPath() !== null) {
			$path = $this->getCurrentPath();
		}

		$path = rtrim($path, "/");

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
		$filters = array();
		$request = Controller::curr()->getRequest();
		$query =  $request->getVar("q");

		$filter_folder = "";
		$filter_name = "";
		$filter_type = "";
		$filter_created_from = "";
		$filter_created_to = "";

		if ($query) {
			if (!empty($query["Folder"])) {
				$filters["filter_folder"] = $query["Folder"];
				$filter_folder = "data-asset-gallery-filter-folder='" . $query["Folder"] . "'";
			}

			if (!empty($query["Name"])) {
				$filters["filter_name"] = $query["Name"];
				$filter_name = "data-asset-gallery-filter-name='" . $query["Name"] . "'";
			}

			if (!empty($query["AppCategory"])) {
				$filters["filter_type"] = $query["AppCategory"];
				$filter_type = "data-asset-gallery-filter-type='" . $query["AppCategory"] . "'";
			}

			if (!empty($query["CreatedFrom"])) {
				$filters["filter_created_from"] = $query["CreatedFrom"];
				$filter_created_from = "data-asset-gallery-filter-created_from='" . $query["CreatedFrom"] . "'";
			}

			if (!empty($query["CreatedTo"])) {
				$filters["filter_created_to"] = $query["CreatedTo"];
				$filter_created_to = "data-asset-gallery-filter-created_to='" . $query["CreatedTo"] . "'";
			}
		}

		$name = $this->getName();
		$data = $this->getData($filters);
		$items = json_encode($data['items']);

		Requirements::css(ASSET_GALLERY_FIELD_DIR . "/public/dist/main.css");
		Requirements::javascript(ASSET_GALLERY_FIELD_DIR . "/public/dist/bundle.js");
		Requirements::customScript("
			window.SS_ASSET_GALLERY = window.SS_ASSET_GALLERY || {};
			window.SS_ASSET_GALLERY['{$name}'] = {$items};
		");

		$dataURL = $this->getDataURL();
		$updateURL = $this->getUpdateURL();
		$deleteURL = $this->getDeleteURL();
		$initialFolder = $this->getCurrentPath();
		$limit = $this->getLimit();

		return "<div
			class='asset-gallery'
			data-asset-gallery-name='{$name}'
			data-asset-gallery-data-url='{$dataURL}'
			data-asset-gallery-update-url='{$updateURL}'
			data-asset-gallery-delete-url='{$deleteURL}'
			data-asset-gallery-initial-folder='{$initialFolder}'
			data-asset-gallery-limit='{$limit}'
			{$filter_folder}
			{$filter_name}
			{$filter_type}
			{$filter_created_from}
			{$filter_created_to}
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
			'type' => $file->is_a('Folder') ? 'folder' : $file->getFileType(),
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

	/**
	 * @param int $limit
	 *
	 * @return $this
	 */
	public function setLimit($limit) {
		$this->limit = $limit;

		return $this;
	}

	/**
	 * @return int
	 */
	public function getLimit() {
		return $this->limit;
	}
}

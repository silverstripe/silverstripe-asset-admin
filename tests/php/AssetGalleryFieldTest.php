<?php
use SilverStripe\Forms\AssetGalleryField;

/**
 * @mixin PHPUnit_Framework_TestCase
 */
class AssetGalleryFieldTest extends SapphireTest {
	/**
	 * @var string
	 */
	public static $fixture_file = 'AssetGalleryFieldTest.yml';

	public function testHasAttributes() {
		$field = new AssetGalleryField("Files1");

		new Form(
			new AssetGalleryFieldTest_Controller(),
			'Foo',
			new FieldList(array(
				$field
			)),
			new FieldList()
		);

		$markup = $field->Field();

		$this->assertContains("name='Files1'", $markup);
		$this->assertContains("data-asset-gallery-search-url=", $markup);
		$this->assertContains("data-asset-gallery-update-url=", $markup);
		$this->assertContains("data-asset-gallery-delete-url=", $markup);
	}

	/**
	 * @param string $name
	 * @param string $form
	 *
	 * @return AssetGalleryField
	 */
	protected function getNewField($name = 'Files1', $form = 'Form1') {
		$field = new AssetGalleryField($name);

		new Form(
			new AssetGalleryFieldTest_Controller(),
			$form,
			new FieldList($field),
			new FieldList()
		);

		return $field;
	}

	public function testItGetsNewData() {
		$this->objFromFixture('AssetGalleryFieldTest_File', 'File1');

		$field = $this->getNewField();
		$field->setCurrentPath('Folder1');

		$response = $field->search(new SS_HTTPRequest('GET', 'http://example.com'));

		$files = json_decode($response->getBody(), true);

		$this->assertArrayHasKey('files', $files);
		$titles = array_map(function($file) {return $file['title'];}, $files['files']);
		$this->assertContains('The First File', $titles);
	}

	public function testItFiltersData() {
		$this->objFromFixture('AssetGalleryFieldTest_File', 'File2');
		$this->objFromFixture('AssetGalleryFieldTest_File', 'File3');

		$field = $this->getNewField();
		$field->setCurrentPath('Folder2');

		$request = new SS_HTTPRequest('GET', 'http://example.com');

		$response = $field->search($request);
		$files = json_decode($response->getBody(), true);

		$this->assertArrayHasKey('files', $files);
		$this->assertCount(2, $files['files']);

		$request = new SS_HTTPRequest('GET', 'http://example.com', array('name' => 'Third'));

		$response = $field->search($request);
		$files = json_decode($response->getBody(), true);

		$this->assertArrayHasKey('files', $files);
		$this->assertCount(1, $files['files']);
		$this->assertEquals('The Third File', $files['files'][0]['title']);
	}

	public function testItRestrictsViewInSearch() {
		$allowedFile = $this->objFromFixture('AssetGalleryFieldTest_File', 'File1');
		$disallowedFile = $this->objFromFixture('AssetGalleryFieldTest_File', 'DisallowCanView');
		$field = $this->getNewField();

		$request = new SS_HTTPRequest('GET', 'http://example.com', ['name' => $allowedFile->Name]);
		$response = $field->search($request);
		$files = json_decode($response->getBody(), true);
		$this->assertArrayHasKey('files', $files);
		$this->assertCount(1, $files['files']);
		$this->assertEquals($allowedFile->ID, $files['files'][0]['id']);

		$request = new SS_HTTPRequest('GET', 'http://example.com', ['name' => $disallowedFile->Name]);
		$response = $field->search($request);
		$files = json_decode($response->getBody(), true);
		$this->assertArrayHasKey('files', $files);
		$this->assertCount(0, $files['files']);
	}

	public function testItRestrictsViewInFetch() {
		$folder1 = $this->objFromFixture('Folder', 'Folder1');
		$allowedFile = $this->objFromFixture('AssetGalleryFieldTest_File', 'File1');
		$disallowedFile = $this->objFromFixture('AssetGalleryFieldTest_File', 'DisallowCanView');
		$field = $this->getNewField();

		$request = new SS_HTTPRequest('GET', 'http://example.com', ['id' => $folder1->ID]);
		$response = $field->fetch($request);
		$files = json_decode($response->getBody(), true);
		$this->assertArrayHasKey('files', $files);
		$ids = array_map(function($file) {return $file['id'];}, $files['files']);
		$this->assertContains($allowedFile->ID, $ids);
		$this->assertEquals($allowedFile->ParentID, $folder1->ID);
		$this->assertNotContains($disallowedFile->ID, $ids);
		$this->assertEquals($disallowedFile->ParentID, $folder1->ID);
	}

	public function testItRestrictsUpdate() {
		$allowedFile = $this->objFromFixture('AssetGalleryFieldTest_File', 'File1');
		$disallowedFile = $this->objFromFixture('AssetGalleryFieldTest_File', 'DisallowCanEdit');
		$field = $this->getNewField();

		$request = new SS_HTTPRequest(
			'POST',
			'http://example.com',
			['id' => $allowedFile->ID, 'title' => 'new']
		);
		$response = $field->update($request);
		$this->assertFalse($response->isError());

		$request = new SS_HTTPRequest(
			'POST',
			'http://example.com',
			['id' => $disallowedFile->ID, 'title' => 'new']
		);
		$response = $field->update($request);
		$this->assertTrue($response->isError());
	}

	public function testItRestrictsDelete() {
		$allowedFile = $this->objFromFixture('AssetGalleryFieldTest_File', 'File1');
		$disallowedFile = $this->objFromFixture('AssetGalleryFieldTest_File', 'DisallowCanDelete');
		$field = $this->getNewField();

		$request = new SS_HTTPRequest(
			'POST',
			'http://example.com',
			['ids' => [$allowedFile->ID, $disallowedFile->ID]]
		);
		$response = $field->delete($request);
		$this->assertTrue($response->isError());

		$request = new SS_HTTPRequest(
			'POST',
			'http://example.com',
			['ids' => [$allowedFile->ID]]
		);
		$response = $field->delete($request);
		$this->assertFalse($response->isError());
	}
}

class AssetGalleryFieldTest_Controller extends ContentController {

}

class AssetGalleryFieldTest_File extends File implements TestOnly {
	public function canView($member = null) {
		return ($this->Name != 'disallowCanView.txt');
	}

	public function canEdit($member = null) {
		return ($this->Name != 'disallowCanEdit.txt');
	}

	public function canDelete($member = null) {
		return ($this->Name != 'disallowCanDelete.txt');
	}
}

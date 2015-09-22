# Asset Gallery Field

## Example

```php
/**
 * @return FieldList
 */
public function getCMSFields() {
	$fields = parent::getCMSFields();

	$fields->addFieldToTab(
		'Root.Main',
		$galleryField = new AssetGalleryField(
			$name = 'Files'
		)
	);

	$galleryField->setCurrentPath("my-image-folder"); // relative to assets

	return $fields;
}
```
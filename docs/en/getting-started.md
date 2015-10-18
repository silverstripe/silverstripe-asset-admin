# Getting Started

## Installing the module

You can install the module by running the following command (from your root application directory):

```
$ composer require silverstripe/asset-gallery-field
```

You'll also need to run `dev/build`.

## Using the module

This module is a required dependency for [silverstripe/cms](https://github.com/silverstripe/silverstripe-cms), from version `4.0`. It replaces the tree view, in the Files area. You do not need to enable this change, and there is no way to reverse the change (on the off chance you liked the tree view). Sorry about that.

On the other hand, there may be times when you want this field. Perhaps you have a new Page structure that needs to link to existing files. Change the `getCMSFields` method to include this field:

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

You can find the selected elements, using jQuery:

```js
let ids = $("[data-asset-gallery-name='MyFilesField'] .item.selected").map(element => element.data("id"));
```

Future versions of this module may scaffold that functionality into the PHP side of things. Time will tell!

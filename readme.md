# Asset Gallery Field

[![Build Status](http://img.shields.io/travis/open-sausages/silverstripe-asset-gallery-field.svg?style=flat-square)](https://travis-ci.org/open-sausages/silverstripe-asset-gallery-field)
[![Code Quality](http://img.shields.io/scrutinizer/g/open-sausages/silverstripe-asset-gallery-field.svg?style=flat-square)](https://scrutinizer-ci.com/g/open-sausages/silverstripe-asset-gallery-field)
[![Code Coverage](http://img.shields.io/scrutinizer/coverage/g/open-sausages/silverstripe-asset-gallery-field.svg?style=flat-square)](https://scrutinizer-ci.com/g/open-sausages/silverstripe-asset-gallery-field)
[![Version](http://img.shields.io/packagist/v/silverstripe/asset-gallery-field.svg?style=flat-square)](https://packagist.org/packages/silverstripe/silverstripe-asset-gallery-field)
[![License](http://img.shields.io/packagist/l/silverstripe/asset-gallery-field.svg?style=flat-square)](LICENSE.md)

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

## Installation

```
$ composer require silverstripe/asset-gallery-field
```

You'll also need to run `dev/build`.

## Documentation

See the [docs/en](docs/en/introduction.md) folder.

## Versioning

This library follows [Semver](http://semver.org). According to Semver, you will be able to upgrade to any minor or patch version of this library without any breaking changes to the public API. Semver also requires that we clearly define the public API for this library.

All methods, with `public` visibility, are part of the public API. All other methods are not part of the public API. Where possible, we'll try to keep `protected` methods backwards-compatible in minor/patch versions, but if you're overriding methods then please test your work before upgrading.

## Reporting Issues

Please [create an issue](http://github.com/open-sausages/silverstripe-asset-gallery-field/issues) for any bugs you've found, or features you're missing.

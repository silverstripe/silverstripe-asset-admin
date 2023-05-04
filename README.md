# Silverstripe Asset Admin Module

[![CI](https://github.com/silverstripe/silverstripe-asset-admin/actions/workflows/ci.yml/badge.svg)](https://github.com/silverstripe/silverstripe-asset-admin/actions/workflows/ci.yml)
[![Silverstripe supported module](https://img.shields.io/badge/silverstripe-supported-0071C4.svg)](https://www.silverstripe.org/software/addons/silverstripe-commercially-supported-module-list/)

## Overview

The Asset Admin module provides a interface for managing files within Silverstripe CMS [assets module](https://github.com/silverstripe/silverstripe-assets). This section shows a library of files available to use on your website and includes images and documents such as PDF files, and can also include javascript files. 

## Installation

```sh
composer require silverstripe/asset-admin
```

## Versioning

This library follows [Semver](http://semver.org). According to Semver, you will be able to upgrade to any minor or patch version of this library without any breaking changes to the public API. Semver also requires that we clearly define the public API for this library.

All methods, with `public` visibility, are part of the public API. All other methods are not part of the public API. Where possible, we'll try to keep `protected` methods backwards-compatible in minor/patch versions, but if you're overriding methods then please test your work before upgrading.

## Reporting Issues

Please [create an issue](http://github.com/silverstripe/silverstripe-asset-admin/issues) for any bugs you've found, or features you're missing.

## Contributing

### Translations

Translations of the natural language strings are managed through a
third party translation interface, transifex.com.
Newly added strings will be periodically uploaded there for translation,
and any new translations will be merged back to the project source code.

Please use [https://www.transifex.com/silverstripe/silverstripe-asset-admin/](https://www.transifex.com/silverstripe/silverstripe-asset-admin/) to contribute translations,
rather than sending pull requests with YAML files.

See the ["i18n" topic](https://docs.silverstripe.org/en/developer_guides/i18n/) on docs.silverstripe.org for more details.

# SilverStripe Asset Admin Module

[![Build Status](http://img.shields.io/travis/silverstripe/silverstripe-asset-admin.svg?style=flat-square)](https://travis-ci.org/silverstripe/silverstripe-asset-admin)
[![Code Quality](http://img.shields.io/scrutinizer/g/silverstripe/silverstripe-asset-admin.svg?style=flat-square)](https://scrutinizer-ci.com/g/silverstripe/silverstripe-asset-admin)
[![Code Climate](https://codeclimate.com/github/silverstripe/silverstripe-asset-admin/badges/gpa.svg)](https://codeclimate.com/github/silverstripe/silverstripe-asset-admin)
[![Version](http://img.shields.io/packagist/v/silverstripe/asset-admin.svg?style=flat-square)](https://packagist.org/packages/silverstripe/asset-admin)
[![License](http://img.shields.io/packagist/l/silverstripe/asset-admin.svg?style=flat-square)](LICENSE.md)
![helpfulrobot](https://helpfulrobot.io/silverstripe/asset-admin/badge)

## Overview

The Asset Admin module provides a interface for managing files within SilverStripe CMS [assets module](https://github.com/silverstripe/silverstripe-assets). This section shows a library of files available to use on your website and includes images and documents such as PDF files, and can also include javascript files. 

## Installation

```
$ composer require silverstripe/asset-admin
```

You'll also need to run `dev/build`.

## Versioning

This library follows [Semver](http://semver.org). According to Semver, you will be able to upgrade to any minor or patch version of this library without any breaking changes to the public API. Semver also requires that we clearly define the public API for this library.

All methods, with `public` visibility, are part of the public API. All other methods are not part of the public API. Where possible, we'll try to keep `protected` methods backwards-compatible in minor/patch versions, but if you're overriding methods then please test your work before upgrading.

## Reporting Issues

Please [create an issue](http://github.com/silverstripe/silverstripe-asset-admin/issues) for any bugs you've found, or features you're missing.

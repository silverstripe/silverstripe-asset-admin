<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Assets\Image;

class ImageFormBuilder extends FileFormFactory
{
    protected function getSpecsMarkup()
    {
        // Add dimensions to specs
        /** @var Image $record */
        $record = $this->getRecord();
        $dimensions = $record->getDimensions() ? $record->getDimensions() . 'px,' : '';
        return sprintf(
            '<div class="editor__specs">%s %s %s</div>',
            $dimensions,
            $record->getSize(),
            $this->getStatusFlagMarkup()
        );
    }
}

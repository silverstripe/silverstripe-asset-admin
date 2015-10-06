import React from 'react';
import galleryActions from '../action/galleryActions';
import CONSTANTS from '../constants';
import classNames from 'classnames';

class Item extends React.Component {

    render() {
        var styles = this.getImageURL(),
            thumbnailClassNames = 'item__thumbnail',
            itemClassNames = classNames({
                'item': true,
                'folder': this.props.type === 'folder'
            });

        if (this.imageLargerThanThumbnail()) {
            thumbnailClassNames += ' large';
        }

        var navigate = function(){
            console.log('not a folder');
        };

        if (this.props.type === 'folder') {
            navigate = this.handleNavigate.bind(this);
        }

        return (
            <div className={itemClassNames + ' ' + this.props.type} onClick={navigate}>
                <div className={thumbnailClassNames} style={styles}>
                    <div className='item__actions'>
                        <button
                            className='item__actions__action item__actions__action--remove [ font-icon-trash ]'
                            type='button'
                            onClick={this.handleDelete.bind(this)}>
                            </button>
                        <button
                            className='item__actions__action item__actions__action--edit [ font-icon-edit ]'
                            type='button'
                            onClick={this.handleEdit.bind(this)}>
                            </button>
                    </div>
                </div>
                <p className='item__title'>{this.props.title}</p>
            </div>
        );
    }

    /**
     * @func handleEdit
     * @desc Event handler for the 'edit' button.
     */
    handleEdit() {
        this.props.setEditing(true, this.props.id);
    }

    /**
     * Event handler for the 'edit' button.
     */
    handleNavigate() {
        galleryActions.navigate(this.props.filename);
    }

    /**
     * Event handler for the 'remove' button.
     */
    handleDelete() {
        //TODO internationalise confirmation message with transifex if/when merged into core
        if (confirm('Are you sure you want to delete this record?')) {
            galleryActions.destroy(this.props.id);
        }
    }

    /**
     * @func getImageURL
     * @desc Return the URL of the image, determined by it's type. 
     */
    getImageURL() {
        if (this.props.type.toLowerCase().indexOf('image') > -1) {
            return {backgroundImage: 'url(' + this.props.url + ')'};
        } else {
            return {};
        }
    }

    /**
     * @func imageLargerThanThumbnail
     * @desc Check if an image is larger than the thumbnail container.
     */
    imageLargerThanThumbnail() {
        return this.props.attributes.dimensions.height > CONSTANTS.ITEM_COMPONENT.THUMBNAIL_HEIGHT || 
               this.props.attributes.dimensions.width > CONSTANTS.ITEM_COMPONENT.THUMBNAIL_WIDTH;
    }
}

Item.propTypes = {
    attributes: React.PropTypes.object,
    id: React.PropTypes.number,
    setEditing: React.PropTypes.func,
    title: React.PropTypes.string,
    type: React.PropTypes.string,
    url: React.PropTypes.string
};

export default Item;

import React from 'react';
import galleryActions from '../action/galleryActions';
import CONSTANTS from '../constants';

class Item extends React.Component {

    render() {
        var styles = {backgroundImage: 'url(' + this.props.url + ')'};

        return (
            <div className='item'>
                <div className='item__thumbnail' style={styles}>
                    <div className='item__actions'>
                        <button
                            className='item__actions__action item__actions__action--remove [ font-icon-cancel-circled ]'
                            type='button'
                            onClick={this.handleDelete.bind(this)}>
                            </button>
                        <button
                            className='item__actions__action item__actions__action--edit [ font-icon-pencil ]'
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
     * @func handleDelete
     * @desc Event handler for the 'remove' button.
     */
    handleDelete() {
        galleryActions.destroy(this.props.id);
    }

}

Item.propTypes = {
    id: React.PropTypes.string,
    setEditing: React.PropTypes.func,
    title: React.PropTypes.string
};

export default Item;

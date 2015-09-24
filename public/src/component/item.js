import React from 'react';
import galleryActions from '../action/galleryActions';
import CONSTANTS from '../constants';

class Item extends React.Component {

    render() {
        return (
            <div className='item'>
                <div className='item__actions'>
                    <button className='item__actions__action item__actions__action--edit' onClick={this.handleEdit.bind(this)}>Edit</button>
                    <button className='item__actions__action item__actions__action--remove' onClick={this.handleRemove.bind(this)}>Remove</button>
                </div>
                <img className='item__thumbnail' src={this.props.url} alt={this.props.title} title={this.props.title} />
                <p className='item__title'>{this.props.title}</p>
            </div>
        );
    }

    /**
     * @func handleEdit
     * @desc Event handler for the 'edit' button.
     */
    handleEdit() {
        // TODO: Will we have an editing React component or render a form server-side?
    }

    /**
     * @func handleRemove
     * @desc Event handler for the 'remove' button.
     */
    handleRemove() {
        galleryActions.destroy(this.props.id);
    }

}

Item.propTypes = {
    id: React.PropTypes.string,
    title: React.PropTypes.string,
    url: React.PropTypes.string
};

export default Item;

import React from 'react';
import Item from './item';
import galleryActions from '../action/galleryActions';
import itemStore from '../store/itemStore';

/**
 * @func getGalleryState
 * @private
 * @return {object}
 * @desc Factory for the gallery's state object.
 */
function getGalleryState() {
    return {
        items: itemStore.getAll()
    };
}

class Gallery extends React.Component {

    constructor(props) {
        super(props);

        var items = window.SS_ASSET_GALLERY[this.props.name];

        // Populate the store.
        for (let i = 0; i < items.length; i += 1) {
            galleryActions.create(items[i], true);
        }

        // Set the initial state of the gallery.
        this.state = getGalleryState();
    }

    componentDidMount () {
        // Interface with the form so we can update state based on changes in the outside world.
        var $form = jQuery(React.findDOMNode(this)).closest('form');

        if ($form.length) {
            $form.on('dirty', () => {
                this.fetch();
            });
        }

        // Explicitly bind the current context to the callback.
        // Node event emitters (the item store) bind their context when the callback it's invoked.
        itemStore.addChangeListener(this.onChange.bind(this));
    }

    componentDidUnmount () {
        // Explicitly bind the current context to the callback.
        // Node event emitters (the item store) bind their context when the callback it's invoked.
        itemStore.removeChangeListener(this.onChange.bind(this));
    }

    render() {
        var items = this.getItemComponents();

        return (
            <div className='gallery'>
                <div className='gallery__items'>
                    {items}
                </div>
            </div>
        );
    }

    /**
     * @func onChange
     * @desc Updates the gallery state when somethnig changes in the store.
     */
    onChange() {
        this.setState(getGalleryState());
    }

    /**
     * @func getItemComponents
     * @desc Generates the item components which populate the gallery.
     */
    getItemComponents() {
        var self = this;

        return Object.keys(this.state.items).map((key) => {
            var item = self.state.items[key],
                props = {};

            props.id = item.id;
            props.title = item.title;
            props.url = item.url;

            return (
                <Item key={key} {...props} />
            );
        });
    }

    /**
     * @func fetch
     * @desc Gets the latest data from the server.
     */
    fetch() {
        return jQuery
            .get(this.props.url)
            .error(() => {
                console.log('error fetching data');
            })
            .done((data) => {
                for (let i = 0; i < data.files.length; i += 1) {
                    galleryActions.create(data.files[i], true);
                    this.state = getGalleryState();
                }
            });
    }

}

export default Gallery;

import React from 'react';
import Editor from './editor';
import Item from './item';
import galleryActions from '../action/galleryActions';
import itemStore from '../store/itemStore';

/**
 * @func getItemStoreState
 * @private
 * @return {object}
 * @desc Factory for getting the current state of the ItemStore.
 */
function getItemStoreState() {
    return {
        items: itemStore.getAll()
    };
}

class Gallery extends React.Component {

    constructor(props) {
        super(props);

        var items = window.SS_ASSET_GALLERY[this.props.name];

        itemStore.data_url = props.data_url;
        itemStore.update_url = props.update_url;
        itemStore.delete_url = props.delete_url;

        // Populate the store.
        for (let i = 0; i < items.length; i += 1) {
            galleryActions.create(items[i], true);
        }

        // Set the initial state of the gallery.
        this.state = getItemStoreState();
        this.state.editing = false;
        this.state.currentItem = null;
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
        // Node event emitters (the item store) bind their context when the callback is invoked.
        itemStore.addChangeListener(this.onChange.bind(this));
    }

    componentDidUnmount () {
        // Explicitly bind the current context to the callback.
        // Node event emitters (the item store) bind their context when the callback is invoked.
        itemStore.removeChangeListener(this.onChange.bind(this));
    }

    render() {
        if (this.state.editing) {
            let editorComponent = this.getEditorComponent();

            return (
                <div className='gallery'>
                    {editorComponent}
                </div>
            );
        } else {
            let items = this.getItemComponents();

            return (
                <div className='gallery'>
                    <div className='gallery__items'>
                        {items}
                    </div>
                </div>
            );
        }
    }

    /**
     * @func onChange
     * @desc Updates the gallery state when somethnig changes in the store.
     */
    onChange() {
        this.setState(getItemStoreState());
    }

    /**
     * @func setEditing
     * @param {boolean} isEditing
     * @param {string} [id]
     * @desc Switches between editing and gallery states.
     */
    setEditing(isEditing, id) {
        var newState = { editing: isEditing };

        if (id !== void 0) {
            let currentItem = itemStore.getById(id);

            if (currentItem !== void 0) {
                this.setState(jQuery.extend(newState, { currentItem: currentItem }));
            }
        } else {
            this.setState(newState);
        }
    }

    /**
     * @func getEditorComponent
     * @desc Generates the editor component.
     */
    getEditorComponent() {
        var props = {};

        props.item = this.state.currentItem;
        props.setEditing = this.setEditing.bind(this);

        return (
            <Editor {...props} />
        );
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
            props.setEditing = this.setEditing.bind(this);
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
            .get(this.props.data_url)
            .error(() => {
                console.log('error fetching data');
            })
            .done((data) => {
                for (let i = 0; i < data.files.length; i += 1) {
                    galleryActions.create(data.files[i], true);
                    this.state = getItemStoreState();
                }
            });
    }

}

export default Gallery;

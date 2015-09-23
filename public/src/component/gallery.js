import React from 'react';
import Item from './item';
import itemActions from '../action/galleryActions';
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

        var items = [
            {
                attributes: {
                    altText: 'Bus',
                    caption: 'Me and my magic bus',
                    dimensions: {
                        original: {
                            height: 200,
                            width: 400
                        },
                        resized: {
                            height: 100,
                            width: 200
                        }
                    },
                    extraClasses: 'img',
                    titleText: 'Magic bus'
                },
                created: '',
                extension: 'png',
                filename: 'magic-bus',
                id: '1',
                lastUpdated: '',
                owner: {
                    id: '1',
                    title: 'David Craig'
                },
                parent: {
                    id: '1',
                    title: 'Uploads'
                },
                relations: [],
                size: '300kb',
                title: 'Bus',
                type: 'Image',
                url: '/assets/Uploads/sausage.jpg'
            }
        ];

        // Populate the store.
        for (let i = 0; i < items.length; i += 1) {
            itemActions.create(items[i]);
        }

        // Set the initial state of the gallery.
        this.state = getGalleryState();
    }

    componentDidMount () {
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

    onChange() {
        this.setState(getGalleryState());
    }

    getItemComponents() {
        var self = this;

        return Object.keys(this.state.items).map((key) => {
            var item = self.state.items[key];

            return (
                <Item key={key} title={item.title} url={item.url} />
            );
        });
    }

}

export default Gallery;

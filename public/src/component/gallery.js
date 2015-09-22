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
                url: '/assets/Uploads/magic-bus.png'
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
        itemStore.addChangeListener(this.onChange);
    }

    componentDidUnmount () {
        itemStore.removeChangeListener(this.onChange);
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
        this.setState(getComponentState());
    }

    getItemComponents() {
        return Object.keys(this.state.items).map((item, i) => {
            return (
                <Item key={i} itemTitle={item.title} />
            );
        });
    }

}

export default Gallery;

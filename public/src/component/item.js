import React from 'react';

class Item extends React.Component {

    render() {
        return (
            <div className='item'>
                <div className='item__toggle'>
                    <button className='item__actions__toggle'>Select</button>
                    <button className='item__actions__edit'>Edit</button>
                    <button className='item__actions__delete'>Delete</button>
                </div>
                <img className='item__thumbnail' src='' alt='' title='' />
                <p className='item__title'>{this.props.title}</p>
            </div>
        );
    }

}

export default Item;

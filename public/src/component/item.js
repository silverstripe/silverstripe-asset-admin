import React from 'react';

class Item extends React.Component {

    render() {
        return (
            <div className='item'>
                <div className='item__actions'>
                    <button className='item__actions__action item__actions__action--toggle'>Select</button>
                    <button className='item__actions__action item__actions__action--edit'>Edit</button>
                    <button className='item__actions__action item__actions__action--delete'>Delete</button>
                </div>
                <img className='item__thumbnail' src={this.props.url} alt={this.props.title} title={this.props.title} />
                <p className='item__title'>{this.props.title}</p>
            </div>
        );
    }

}

Item.propTypes = {
    title: React.PropTypes.string,
    url: React.PropTypes.string
};

export default Item;

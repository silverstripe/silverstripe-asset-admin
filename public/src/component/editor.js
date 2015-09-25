import React from 'react';

/**
 * @func Editor
 * @desc Used to edit the properties of an Item.
 */
class Editor extends React.Component {

    render() {
        return (
            <div className='editor'>
                <button
                    type='button'
                    onClick={this.handleBack.bind(this)}>
                    Back to gallery
                    </button>
                <form>
                    <div className='CompositeField composite cms-file-info nolabel'>
                        <div className='CompositeField composite cms-file-info-preview nolabel'>
                            <img className='thumbnail-preview' src={this.props.item.url} />
                        </div>
                        <div className='CompositeField composite cms-file-info-data nolabel'>
                            <div className='CompositeField composite nolabel'>
                                <div className='field readonly'>
                                    <label className='left'>File type:</label>
                                    <div className='middleColumn'>
                                        <span className='readonly'>{this.props.item.type}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='field readonly'>
                                <label className='left'>File size:</label>
                                <div className='middleColumn'>
                                    <span className='readonly'>{this.props.item.size}</span>
                                </div>
                            </div>
                            <div className='field readonly'>
                                <label className='left'>URL:</label>
                                <div className='middleColumn'>
                                    <span className='readonly'>
                                        <a href={this.props.item.url} target='_blank'>{this.props.item.url}</a>
                                    </span>
                                </div>
                            </div>
                            <div className='field date_disabled readonly'>
                                <label className='left'>First uploaded:</label>
                                <div className='middleColumn'>
                                    <span className='readonly'>{this.props.item.created}</span>
                                </div>
                            </div>
                            <div className='field date_disabled readonly'>
                                <label className='left'>Last changed:</label>
                                <div className='middleColumn'>
                                    <span className='readonly'>{this.props.item.lastUpdated}</span>
                                </div>
                            </div>
                            <div className='field readonly'>
                                <label className='left'>Dimensions:</label>
                                <div className='middleColumn'>
                                    <span className='readonly'>{this.props.item.attributes.dimensions.width} x {this.props.item.attributes.dimensions.height}px</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='field text'>
                        <label className='left'>Title</label>
                        <div className='middleColumn'>
                            <input className='text' type='text' name='Title' value={this.props.item.title} />
                        </div>
                    </div>
                    <div className='field text'>
                        <label className='left'>Filename</label>
                        <div className='middleColumn'>
                            <input className='text' type='text' name='Name' value={this.props.item.filename} />
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    /**
     * @func handleBack
     * @desc Handles clicks on the back button. Switches back to the 'gallery' view.
     */
    handleBack() {
        this.props.setEditing(false);
    }

}

Editor.propTypes = {
    item: React.PropTypes.object,
    setEditing: React.PropTypes.func
};

export default Editor;

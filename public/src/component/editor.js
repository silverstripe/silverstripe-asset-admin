import React from 'react';
import InputField from './inputField';
import editorActions from '../action/editorActions';
import editorStore from '../store/editorStore';

/**
 * @func getEditorStoreState
 * @private
 * @return {object}
 * @desc Factory for getting the current state of the ItemStore.
 */
function getEditorStoreState() {
    return {
        fields: editorStore.getAll()
    };
}

/**
 * @func Editor
 * @desc Used to edit the properties of an Item.
 */
class Editor extends React.Component {

    constructor(props) {
        super(props);

        // Manually bind so listeners are removed correctly
        this.onChange = this.onChange.bind(this);

        // Populate the store.
        editorActions.create({ name: 'title', value: props.item.title }, true);
        editorActions.create({ name: 'filename', value: props.item.filename }, true);

        this.state = getEditorStoreState();
    }

    componentDidMount () {
        editorStore.addChangeListener(this.onChange);
    }

    componentWillUnmount () {
        editorStore.removeChangeListener(this.onChange);
    }

    render() {
        var textFields = this.getTextFieldComponents();

        return (
            <div className='editor'>
                <button
                    type='button'
                    className='ss-ui-button ui-corner-all font-icon-level-up'
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

                    {textFields}

                    <div>
                        <button type='submit' className="ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-check-mark">Save</button>
                        <button type='button' className="ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-cancel-circled" onClick={this.handleCancel.bind(this)} >Cancel</button>
                    </div>
                </form>
            </div>
        );
    }

    /**
     * @func getTextFieldComponents
     * @desc Generates the editable text field components for the form.
     */
    getTextFieldComponents() {
        return Object.keys(this.state.fields).map((key) => {
            var field = this.state.fields[key];

            return (
                <div className='field text' key={key}>
                    <label className='left'>{field.name}</label>
                    <div className='middleColumn'>
                        <InputField name={field.name} value={field.value} />
                    </div>
                </div>
            )
        });
    }

    /**
     * @func onChange
     * @desc Updates the editor state when something changes in the store.
     */
    onChange() {
        this.setState(getEditorStoreState());
    }

    /**
     * @func handleBack
     * @desc Handles clicks on the back button. Switches back to the 'gallery' view.
     */
    handleBack() {
        editorActions.clear(true);
        this.props.setEditing(false);
    }

    /**
     * @func handleSave
     * @desc Handles clicks on the save button
     */
    handleSave() {
        // TODO:
    }

    /**
     * @func handleCancel
     * @param {object} event
     * @desc Resets the form to it's origional state.
     */
    handleCancel() {
        editorActions.update({ name: 'title', value: this.props.item.title });
        editorActions.update({ name: 'filename', value: this.props.item.filename });
    }

}

Editor.propTypes = {
    item: React.PropTypes.object,
    setEditing: React.PropTypes.func
};

export default Editor;

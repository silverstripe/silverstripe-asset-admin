import i18n from 'i18n';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as editorActions from 'state/editor/actions';
import TextFieldComponent from 'components/text-field/index';

class EditorContainer extends Component {
  constructor(props) {
    super(props);

    const file = this.props.file;

    this.fields = [
      {
        label: 'Title',
        name: 'title',
        value: file === null ? file : file.title,
      },
      {
        label: 'Filename',
        name: 'basename',
        value: file === null ? file : file.basename,
      },
    ];

    this.onFieldChange = this.onFieldChange.bind(this);
    this.onFileSave = this.onFileSave.bind(this);
  }

  componentDidMount() {
    this.props.actions.setEditorFields(this.fields);
  }

  componentWillUnmount() {
    this.props.actions.setEditorFields();
  }

  onFieldChange(event) {
    this.props.actions.updateEditorField({
      name: event.target.name,
      value: event.target.value,
    });
  }

  onFileSave(event) {
    this.props.onFileSave(this.props.file.id, this.props.editorFields);

    event.stopPropagation();
    event.preventDefault();
  }

  render() {
    if (!this.props.visible) {
      return null;
    }

    return (<div className="editor-component">
      <div className="CompositeField composite cms-file-info nolabel">
        <div className="CompositeField composite cms-file-info-preview nolabel">
          <img alt={this.props.file.title} className="thumbnail-preview" src={this.props.file.url} />
        </div>
        <div className="CompositeField composite cms-file-info-data nolabel">
          <div className="CompositeField composite nolabel">
            <div className="field readonly">
              <label className="left">{i18n._t('AssetGalleryField.TYPE')}:</label>
              <div className="middleColumn">
                <span className="readonly">{this.props.file.type}</span>
              </div>
            </div>
          </div>
          <div className="field readonly">
            <label className="left">{i18n._t('AssetGalleryField.SIZE')}:</label>
            <div className="middleColumn">
              <span className="readonly">{this.props.file.size}</span>
            </div>
          </div>
          <div className="field readonly">
            <label className="left">{i18n._t('AssetGalleryField.URL')}:</label>
            <div className="middleColumn">
              <span className="readonly">
                <a href={this.props.file.url} target="_blank">{this.props.file.url}</a>
              </span>
            </div>
          </div>
          <div className="field date_disabled readonly">
            <label className="left">{i18n._t('AssetGalleryField.CREATED')}:</label>
            <div className="middleColumn">
              <span className="readonly">{this.props.file.created}</span>
            </div>
          </div>
          <div className="field date_disabled readonly">
            <label className="left">{i18n._t('AssetGalleryField.LASTEDIT')}:</label>
            <div className="middleColumn">
              <span className="readonly">{this.props.file.lastUpdated}</span>
            </div>
          </div>
          <div className="field readonly">
            <label className="left">{i18n._t('AssetGalleryField.DIM')}:</label>
            <div className="middleColumn">
              <span className="readonly">
                {this.props.file.attributes.dimensions.width}
                x
                {this.props.file.attributes.dimensions.height}
                px
              </span>
            </div>
          </div>
        </div>
      </div>
      {this.props.editorFields.map((field, i) =>
        (
          <TextFieldComponent
            key={i}
            label={field.label}
            name={field.name}
            value={this.props.file[field.name]}
            onChange={this.onFieldChange}
          />
        )
      )}
      <div>
        <button
          type="submit"
          className="ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-check-mark"
          onClick={this.onFileSave}
        >
          {i18n._t('AssetGalleryField.SAVE')}
        </button>
        <button
          type="button"
          className="ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-cancel-circled"
          onClick={this.props.onClose}
        >
          {i18n._t('AssetGalleryField.CANCEL')}
        </button>
      </div>
    </div>);
  }
}

EditorContainer.propTypes = {
  visible: React.PropTypes.bool,
  file: React.PropTypes.shape({
    id: React.PropTypes.number,
    title: React.PropTypes.string,
    basename: React.PropTypes.string,
    url: React.PropTypes.string,
    size: React.PropTypes.string,
    type: React.PropTypes.string,
    created: React.PropTypes.string,
    lastUpdated: React.PropTypes.string,
    attributes: React.PropTypes.shape({
      dimensions: React.PropTypes.shape({
        width: React.PropTypes.number,
        height: React.PropTypes.number,
      }),
    }),
  }),
  editorFields: React.PropTypes.array,
  actions: React.PropTypes.object,
  onClose: React.PropTypes.func.isRequired,
  onFileSave: React.PropTypes.func,
};

function mapStateToProps(state) {
  return {
    visible: state.assetAdmin.editor.visible,
    file: state.assetAdmin.editor.editing,
    editorFields: state.assetAdmin.editor.editorFields,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(editorActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorContainer);

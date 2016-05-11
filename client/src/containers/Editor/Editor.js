import i18n from 'i18n';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as editorActions from 'state/editor/EditorActions';
import TextFieldComponent from 'components/TextField/TextField';
import FormAction from 'components/FormAction/FormAction';

class Editor extends Component {
  constructor(props) {
    super(props);

    this.handleFieldUpdate = this.handleFieldUpdate.bind(this);
    this.handleFileSave = this.handleFileSave.bind(this);

    this.state = {
      isSaving: false,
    };
  }

  componentDidMount() {
    // TODO Use form field schema (which will also take care of i18n)
    // Values for fields are set via the action
    const fields = [
      {
        label: 'Title',
        name: 'title',
      },
      {
        label: 'Filename',
        // TODO Use same property names as DataObject
        name: 'basename',
      },
    ];
    this.props.actions.setEditorFields(fields);
  }

  componentWillUnmount() {
    this.props.actions.setEditorFields();
  }

  handleFileSave(event) {
    if (this.props.onFileSave) {
      this.setState({ isSaving: true });
      const updates = this.props.editorFields.reduce(
        (prev, curr) => Object.assign({}, prev, { [curr.name]: curr.value }),
        {}
      );
      this.props.onFileSave(this.props.file.id, updates)
        .then(() => this.setState({ isSaving: false }));
    }

    event.stopPropagation();
    event.preventDefault();
  }

  handleFieldUpdate(event) {
    this.props.actions.updateEditorField({
      name: event.target.name,
      value: event.target.value,
    });
  }

  render() {
    if (!this.props.visible) {
      return null;
    }

    return (<div className="editor-component container-fluid">
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
            leftTitle={field.label}
            name={field.name}
            value={field.value}
            onChange={this.handleFieldUpdate}
          />
        )
      )}
      <div>
        <FormAction
          type="submit"
          bootstrapButtonStyle="primary"
          icon="save"
          handleClick={this.handleFileSave}
          loading={this.state.isSaving}
          label={i18n._t('AssetGalleryField.SAVE')}
        />
        <FormAction
          bootstrapButtonStyle="secondary"
          handleClick={this.props.onClose}
          label={i18n._t('AssetGalleryField.CANCEL')}
        />
      </div>
    </div>);
  }
}

Editor.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Editor);

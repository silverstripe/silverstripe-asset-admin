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
        value: this.props.file.title,
      },
      {
        label: 'Filename',
        // TODO Use same property names as DataObject
        name: 'basename',
        value: this.props.file.basename,
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
    return (<div className="editor container-fluid">
      <a
        tabIndex="1"
        className="btn btn--top-right btn--no-text font-icon-cancel btn--icon-xl"
        onClick={this.props.onClose}
        type="button"
        aria-label={i18n._t('AssetGalleryField.CANCEL')}
      />

      <div className="editor__details">
        <h1 className="editor__heading">{this.props.file.title}</h1>
        <p className="header-extra small readonly">
          {this.props.file.attributes.dimensions.width} x&nbsp;
          {this.props.file.attributes.dimensions.height}px,
          {this.props.file.size}
        </p>

        <div className="file-preview">
          <img className="file-preview-thumbnail" src={this.props.file.url} alt={this.props.file.title} />
          <a href={this.props.file.url} target="_blank" className="file-enlarge font-icon-search btn--no-text"></a>
        </div>

        <ul className="nav nav-tabs hidden-xs-up" role="tablist">
          <li className="nav-item">
            <a className="nav-link active" data-toggle="tab" href="#file-details" role="tab">Details</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#file-usage" role="tab">Usage</a>
          </li>
        </ul>

        <div className="tab-content">
          <div className="tab-pane active" id="file-details" role="tabpanel">

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

            <div className="form-group">
              <label htmlFor="folderLocation">Folder location</label>
              <input type="text" className="form-control" id="folderLocation" value="uploads/folder name/" disabled />
            </div>

            <div className="media form-group break-string">
              <div className="media-left">
                <i className="font-icon-link"></i>
              </div>
              <div className="media-body">
                <a href={this.props.file.url} target="_blank">{this.props.file.url}</a>
              </div>
            </div>

            <div className="btn-toolbar">
              <div className="btn-group" role="group" aria-label="">
                <FormAction
                  type="submit"
                  bootstrapButtonStyle="primary"
                  icon="save"
                  handleClick={this.handleFileSave}
                  loading={this.state.isSaving}
                  label={i18n._t('AssetGalleryField.SAVE')}
                />
                <FormAction
                  type="submit"
                  bootstrapButtonStyle="primary"
                  icon="rocket"
                  handleClick={this.onFilePublish}
                  loading={this.state.isSaving}
                  label={i18n._t('AssetGalleryField.PUBLISH')}
                />
              </div>

              <button
                type="button"
                data-container="body"
                className="btn btn-secondary font-icon-dot-3 btn--no-text btn--icon-large"
                data-toggle="popover"
                title="Page actions"
                data-placement="top"
                data-content="<a href=''>Add to campaign</a><a href=''>Remove from campaign</a>"
              >
              </button>
            </div>
          </div>

          <div className="tab-pane hidden-xs-up" id="file-usage" role="tabpanel">

            <ul className="list-unstyled text-muted m-b-2">
              <li>{this.props.file.type}</li>
              <li>{i18n._t('AssetGalleryField.CREATED')} {this.props.file.created}</li>
              <li>{i18n._t('AssetGalleryField.LASTEDIT')} {this.props.file.lastUpdated}</li>
            </ul>

            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Used on</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-primary">
                  <th scope="row">1</th>
                  <td>About us<small className="additional-info">Page</small></td>
                  <td><span className="label label-info">Draft</span></td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td><a href="">My great blog post</a><small className="additional-info">Blog post</small></td>
                  <td><span className="label label-success">Published</span></td>
                </tr>
                <tr>
                  <th scope="row">3</th>
                  <td><a href="">Our services</a><small className="additional-info">Services Page</small></td>
                  <td><span className="label label-success">Published</span></td>
                </tr>
                <tr>
                  <th scope="row">4</th>
                  <td><a href="">June release</a><small className="additional-info">Campaign</small></td>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">5</th>
                  <td><a href="">Marketing</a><small className="additional-info">Campaign</small></td>
                  <td><span className="label label-warning">Scheduled</span></td>
                </tr>
                <tr>
                  <th scope="row">6</th>
                  <td><a href="">Services section</a><small className="additional-info">Campaign</small></td>
                  <td><span className="label label-success">Published</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>);
  }
}

Editor.propTypes = {
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
    editorFields: state.assetAdmin.editor.editorFields,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(editorActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);

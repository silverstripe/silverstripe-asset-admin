import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
import EditorHeader, { buttonStates } from '../EditorHeader';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs/react';

const editorStyle = {
  width: 447,
  borderLeft: '1px solid #ced5e1',
  position: 'absolute',
  textAlign: 'left',
  margin: '0 0 0 -447px',
  top: 0,
  left: '100%',
};

const actionMaker = (name) => {
  const fn = action(name);
  fn.toString = () => name;
  return fn;
};

const onCancel = actionMaker('onCancel');
const onDetails = actionMaker('onDetails');

storiesOf('AssetAdmin/Editor', module)
  .addDecorator((storyFn) => (
    <div className="panel form--no-dividers editor" style={editorStyle}>
      <div className="editor__details fill-height">
        <form className="form form--fill-height form--padded">
          <fieldset>
            {storyFn()}
            <div className="editor__file-preview">
              <div className="editor__thumbnail-container">
                <a className="editor__file-preview-link" href="#">
                  <img
                    width="597"
                    height="336"
                    alt="preview"
                    className="editor__thumbnail"
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
                  />
                </a>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  ))
  .addDecorator(withKnobs)
  .add('EditorHeader', () => (
    <EditorHeader
      onCancel={onCancel}
      onDetails={boolean('Enable onDetail') && onDetails}
      showButton={select('showButton', buttonStates)}
    >
      <div className="field CompositeField fieldgroup form-group--no-label position-relative form-group">
        <div className="form__field-holder">
          <div className="field-group-component field-group-component__small-holder field CompositeField fieldgroup form-group--no-label">
            <div className="field">
              <h1 className="editor__heading">{text('Filename', 'Crazy fox jumps')}</h1>
            </div>
            <div className="readonly" name="FileSpecs">
              <div className="editor__specs">
                1920x1080px 132 KB
                <span className="editor__status-flag">Modified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EditorHeader>
  ));


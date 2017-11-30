import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import { Component as BackButton } from 'components/BackButton/BackButton';

storiesOf('AssetAdmin/BackButton', module)
  .add('Default', () => (
    <BackButton />
  ))
  .add('With badge', () => (
    <BackButton badge={{ message: '+3', status: 'success' }} />
  ))
  .add('Enlarged', () => (
    <BackButton enlarged />
  ));

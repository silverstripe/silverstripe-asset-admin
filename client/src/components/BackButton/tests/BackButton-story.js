import React from 'react';
import { Component as BackButton } from 'components/BackButton/BackButton';

export default {
  title: 'AssetAdmin/BackButton',
};

export const Default = () => <BackButton />;

export const WithBadge = () => (
  <BackButton badge={{ message: '+3', status: 'success' }} />
);

WithBadge.story = {
  name: 'With badge',
};

export const Enlarged = () => <BackButton enlarged />;

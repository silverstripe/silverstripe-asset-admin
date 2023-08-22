/* global jest, describe, it, expect, beforeEach, FormData */

import getStatusCodeMessage from '../getStatusCodeMessage';

describe('getStatusCodeMessage', () => {
  const defaultMessage = getStatusCodeMessage(999);
  it('Has a default message', () => {
    expect(defaultMessage.length > 0).toBe(true);
  });
  it('To have a different message for a 413 status code', () => {
    const status413Message = getStatusCodeMessage(413);
    expect(status413Message.length > 0 && status413Message !== defaultMessage).toBe(true);
  });
  it('To display validation messages for a 403 status code', () => {
    const mockResponse = {
      responseType: '',
      response: 'Validation Message',
    };
    const status403Message = getStatusCodeMessage(403, mockResponse);
    expect(status403Message.length > 0 && status403Message !== defaultMessage).toBe(true);
    expect(status403Message).toBe('Validation Message');

    const mockNonTextResponse = {
      responseType: 'arraybuffer',
      response: new ArrayBuffer(),
    };
    const status403NonTextMessage = getStatusCodeMessage(403, mockNonTextResponse);
    expect(status403NonTextMessage.length > 0 && status403NonTextMessage === defaultMessage)
      .toBe(true);
  });
});

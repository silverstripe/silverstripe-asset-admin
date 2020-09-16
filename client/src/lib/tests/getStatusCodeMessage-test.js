/* global jest, jasmine, describe, it, expect, beforeEach, FormData */

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
});

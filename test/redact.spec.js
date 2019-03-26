import {REDACTED, redact} from '../lib/redact';

describe('module:redact', function() {
  describe('redact()', function() {
    describe('when provided an object with secret keys', function() {
      let obj;

      beforeEach(function() {
        obj = {
          FOO_SESSION_ID: 'aklsdjhflskfjdf',
          PASSWD: 'alsjkdfkl',
          OK: 'ok',
          stuff: {
            SECRET: 'kjdfgshfkdsjfh',
            API_KEY: 'kldjfghn,vcx',
            'ACCESS-KEY': 'gkasdjhfksd'
          },
          things: ['THING_TOKEN']
        };
      });

      it('should redact the values', function() {
        expect(redact(obj), 'to equal', {
          FOO_SESSION_ID: REDACTED,
          PASSWD: REDACTED,
          OK: 'ok',
          stuff: {
            SECRET: REDACTED,
            API_KEY: REDACTED,
            'ACCESS-KEY': REDACTED
          },
          things: REDACTED
        });
      });
    });
  });
});

/* eslint-disable no-console */
import newrelic from 'newrelic';

const log = {
  info: (message: string) => {
    console.info(message);

    try {
      newrelic.recordLogEvent({
        message: message,
        level: 'info',
      });
    }
    catch { }
  },
  warning: (message: string) => {
    console.warn(message);

    try {
      newrelic.recordLogEvent({
        message: message,
        level: 'warn',
      });
    }
    catch { }
  },

  error: (message: string, error: unknown, expected?: boolean) => {
    console.error(message, error);

    if (typeof newrelic === 'undefined') {
      return;
    }
    try {
      if (error instanceof Error) {
        newrelic.noticeError(error, expected);
      }
      else {
        newrelic.noticeError(new Error(message), expected);
      }
    }
    catch { }
  },
};

export default log;

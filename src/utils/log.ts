/* eslint-disable no-console */
import newrelic from "newrelic";

const log = {
  info: (message: string) => {
    console.info(message);

    newrelic.recordLogEvent({
      message: message,
      level: 'info'
    })
  },
  warning: (message: string) => {
    console.warn(message)

    newrelic.recordLogEvent({
      message: message,
      level: 'warn'
    })
  },

  error: (message: string, error: unknown, expected?: boolean) => {
    console.error(message, error);

    if (error instanceof Error){
      newrelic.noticeError(error, expected)
    } else {
      newrelic.noticeError(new Error(message), expected);
    }
  }
}

export default log;

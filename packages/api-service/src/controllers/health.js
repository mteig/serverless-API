import { middify, log } from 'app-tools';

const innerHandler = async (event, context) => {
  log.info({ event, context });
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Ok' }),
  };
};

export const handler = middify(innerHandler);

import { log } from './log.js';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export async function createResponse(promise, statusCode) {
  try {
    const result = await promise;
    log.info({ result }, 'Result received');
    result.success = result.success ? '1' : '0';
    if (result.id) {
      result.idInt = result.id;
      result.idStr = result.id.toString();
    }
    result.resfresh_Location = result.resfresh_Location ? '1' : '0';
    return {
      statusCode: statusCode || result.statusCode || 200,
      body: JSON.stringify(result || {}),
      headers,
    };
  } catch (error) {
    log.error({ error }, 'Request implementation failed');
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false }),
      headers,
    };
  }
}

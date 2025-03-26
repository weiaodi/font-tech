import { htmlReport } from '../bundle/htmlReport.js';
import { textSummary } from '../bundle/textSummary.js';

/**
 *
 *
 * @export
 * @param {*} data
 * @return {*}
 */
export function handleSummary(data) {
  return {
    'result.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

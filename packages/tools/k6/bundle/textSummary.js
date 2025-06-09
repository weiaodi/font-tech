/* eslint-disable */

let forEach = function (obj, callback) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (callback(key, obj[key])) {
        break;
      }
    }
  }
};

let palette = {
  bold: 1,
  faint: 2,
  red: 31,
  green: 32,
  cyan: 36,
  // TODO: add others?
};

let groupPrefix = '█';
let detailsPrefix = '↳';
let succMark = '✓';
let failMark = '✗';
let defaultOptions = {
  indent: ' ',
  enableColors: true,
  summaryTimeUnit: null,
  summaryTrendStats: null,
};

// strWidth tries to return the actual width the string will take up on the
// screen, without any terminal formatting, unicode ligatures, etc.
function strWidth(s) {
  // TODO: determine if NFC or NFKD are not more appropriate? or just give up? https://hsivonen.fi/string-length/
  let data = s.normalize('NFKC'); // This used to be NFKD in Go, but this should be better
  let inEscSeq = false;
  let inLongEscSeq = false;
  let width = 0;
  for (let char of data) {
    if (char.done) {
      break;
    }

    // Skip over ANSI escape codes.
    if (char == '\x1b') {
      inEscSeq = true;
      continue;
    }
    if (inEscSeq && char == '[') {
      inLongEscSeq = true;
      continue;
    }
    if (inEscSeq && inLongEscSeq && char.charCodeAt(0) >= 0x40 && char.charCodeAt(0) <= 0x7e) {
      inEscSeq = false;
      inLongEscSeq = false;
      continue;
    }
    if (inEscSeq && !inLongEscSeq && char.charCodeAt(0) >= 0x40 && char.charCodeAt(0) <= 0x5f) {
      inEscSeq = false;
      continue;
    }

    if (!inEscSeq && !inLongEscSeq) {
      width++;
    }
  }
  return width;
}

function summarizeCheck(indent, check, decorate) {
  if (check.fails == 0) {
    return decorate(indent + succMark + ' ' + check.name, palette.green);
  }

  let succPercent = Math.floor((100 * check.passes) / (check.passes + check.fails));
  return decorate(
    indent
      + failMark
      + ' '
      + check.name
      + '\n'
      + indent
      + ' '
      + detailsPrefix
      + '  '
      + succPercent
      + '% — '
      + succMark
      + ' '
      + check.passes
      + ' / '
      + failMark
      + ' '
      + check.fails,
    palette.red,
  );
}

function summarizeGroup(indent, group, decorate) {
  // 存储结果的数组
  const result = [];
  const groupPrefix = 'YourGroupPrefix'; // 假设 groupPrefix 是一个常量，这里需要根据实际情况定义
  // 如果组有名称，将其添加到结果中并增加缩进
  if (group.name) {
    result.push(`${indent}${groupPrefix} ${group.name}\n`);
    // 生成新的缩进，不改变原 indent 变量
    const newIndent = indent + '  ';

    // 总结组内的检查项
    for (const check of group.checks) {
      result.push(summarizeCheck(newIndent, check, decorate));
    }

    // 如果组内有检查项，添加一个空行
    if (group.checks.length > 0) {
      result.push('');
    }

    // 递归总结子组
    for (const subGroup of group.groups) {
      result.push(...summarizeGroup(newIndent, subGroup, decorate));
    }
  } else {
    // 若组没有名称，使用原缩进处理检查项和子组
    for (const check of group.checks) {
      result.push(summarizeCheck(indent, check, decorate));
    }

    if (group.checks.length > 0) {
      result.push('');
    }

    for (const subGroup of group.groups) {
      result.push(...summarizeGroup(indent, subGroup, decorate));
    }
  }

  return result;
}

function displayNameForMetric(name) {
  let subMetricPos = name.indexOf('{');
  if (subMetricPos >= 0) {
    return '{ ' + name.substring(subMetricPos + 1, name.length - 1) + ' }';
  }
  return name;
}

function indentForMetric(name) {
  if (name.indexOf('{') >= 0) {
    return '  ';
  }
  return '';
}

function humanizeBytes(bytes) {
  let units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let base = 1000;
  if (bytes < 10) {
    return bytes + ' B';
  }

  let e = Math.floor(Math.log(bytes) / Math.log(base));
  let suffix = units[e | 0];
  let val = Math.floor((bytes / base ** e) * 10 + 0.5) / 10;
  return val.toFixed(val < 10 ? 1 : 0) + ' ' + suffix;
}

let unitMap = {
  s: { unit: 's', coef: 0.001 },
  ms: { unit: 'ms', coef: 1 },
  us: { unit: 'µs', coef: 1000 },
};

function toFixedNoTrailingZeros(val, prec) {
  // TODO: figure out something better?
  return parseFloat(val.toFixed(prec)).toString();
}

function toFixedNoTrailingZerosTrunc(val, prec) {
  let mult = 10 ** prec;
  return toFixedNoTrailingZeros(Math.trunc(mult * val) / mult, prec);
}

function humanizeGenericDuration(dur) {
  if (dur === 0) {
    return '0s';
  }

  if (dur < 0.001) {
    // smaller than a microsecond, print nanoseconds
    return Math.trunc(dur * 1000000) + 'ns';
  }
  if (dur < 1) {
    // smaller than a millisecond, print microseconds
    return toFixedNoTrailingZerosTrunc(dur * 1000, 2) + 'µs';
  }
  if (dur < 1000) {
    // duration is smaller than a second
    return toFixedNoTrailingZerosTrunc(dur, 2) + 'ms';
  }

  let result = toFixedNoTrailingZerosTrunc((dur % 60000) / 1000, dur > 60000 ? 0 : 2) + 's';
  let rem = Math.trunc(dur / 60000);
  if (rem < 1) {
    // less than a minute
    return result;
  }
  result = (rem % 60) + 'm' + result;
  rem = Math.trunc(rem / 60);
  if (rem < 1) {
    // less than an hour
    return result;
  }
  return rem + 'h' + result;
}

function humanizeDuration(dur, timeUnit) {
  if (timeUnit !== '' && unitMap.hasOwnProperty(timeUnit)) {
    return (dur * unitMap[timeUnit].coef).toFixed(2) + unitMap[timeUnit].unit;
  }

  return humanizeGenericDuration(dur);
}

function humanizeValue(val, metric, timeUnit) {
  if (metric.type == 'rate') {
    // Truncate instead of round when decreasing precision to 2 decimal places
    return (Math.trunc(val * 100 * 100) / 100).toFixed(2) + '%';
  }

  switch (metric.contains) {
    case 'data':
      return humanizeBytes(val);
    case 'time':
      return humanizeDuration(val, timeUnit);
    default:
      return toFixedNoTrailingZeros(val, 6);
  }
}

function nonTrendMetricValueForSum(metric, timeUnit) {
  switch (metric.type) {
    case 'counter':
      return [
        humanizeValue(metric.values.count, metric, timeUnit),
        humanizeValue(metric.values.rate, metric, timeUnit) + '/s',
      ];
    case 'gauge':
      return [
        humanizeValue(metric.values.value, metric, timeUnit),
        'min=' + humanizeValue(metric.values.min, metric, timeUnit),
        'max=' + humanizeValue(metric.values.max, metric, timeUnit),
      ];
    case 'rate':
      return [
        humanizeValue(metric.values.rate, metric, timeUnit),
        succMark + ' ' + metric.values.passes,
        failMark + ' ' + metric.values.fails,
      ];
    default:
      return ['[no data]'];
  }
}

function summarizeMetrics(options, data, decorate) {
  let indent = options.indent + '  ';
  let result = [];

  let names = [];
  let nameLenMax = 0;

  let nonTrendValues = {};
  let nonTrendValueMaxLen = 0;
  let nonTrendExtras = {};
  let nonTrendExtraMaxLens = [0, 0];

  let trendCols = {};
  let numTrendColumns = options.summaryTrendStats.length;
  let trendColMaxLens = new Array(numTrendColumns).fill(0);
  forEach(data.metrics, function (name, metric) {
    names.push(name);
    // When calculating widths for metrics, account for the indentation on submetrics.
    let displayName = indentForMetric(name) + displayNameForMetric(name);
    let displayNameWidth = strWidth(displayName);
    if (displayNameWidth > nameLenMax) {
      nameLenMax = displayNameWidth;
    }

    if (metric.type == 'trend') {
      let cols = [];
      for (var i = 0; i < numTrendColumns; i++) {
        let tc = options.summaryTrendStats[i];
        let value = metric.values[tc];
        if (tc === 'count') {
          value = value.toString();
        } else {
          value = humanizeValue(value, metric, options.summaryTimeUnit);
        }
        let valLen = strWidth(value);
        if (valLen > trendColMaxLens[i]) {
          trendColMaxLens[i] = valLen;
        }
        cols[i] = value;
      }
      trendCols[name] = cols;
      return;
    }
    let values = nonTrendMetricValueForSum(metric, options.summaryTimeUnit);
    nonTrendValues[name] = values[0];
    let valueLen = strWidth(values[0]);
    if (valueLen > nonTrendValueMaxLen) {
      nonTrendValueMaxLen = valueLen;
    }
    nonTrendExtras[name] = values.slice(1);
    for (var i = 1; i < values.length; i++) {
      let extraLen = strWidth(values[i]);
      if (extraLen > nonTrendExtraMaxLens[i - 1]) {
        nonTrendExtraMaxLens[i - 1] = extraLen;
      }
    }
  });

  names.sort();

  let getData = function (name) {
    if (trendCols.hasOwnProperty(name)) {
      let cols = trendCols[name];
      let tmpCols = new Array(numTrendColumns);
      for (var i = 0; i < cols.length; i++) {
        tmpCols[i] =
          options.summaryTrendStats[i]
          + '='
          + decorate(cols[i], palette.cyan)
          + ' '.repeat(trendColMaxLens[i] - strWidth(cols[i]));
      }
      return tmpCols.join(' ');
    }

    let value = nonTrendValues[name];
    let fmtData = decorate(value, palette.cyan) + ' '.repeat(nonTrendValueMaxLen - strWidth(value));

    let extras = nonTrendExtras[name];
    if (extras.length == 1) {
      fmtData = fmtData + ' ' + decorate(extras[0], palette.cyan, palette.faint);
    } else if (extras.length > 1) {
      let parts = new Array(extras.length);
      for (var i = 0; i < extras.length; i++) {
        parts[i] =
          decorate(extras[i], palette.cyan, palette.faint) + ' '.repeat(nonTrendExtraMaxLens[i] - strWidth(extras[i]));
      }
      fmtData = fmtData + ' ' + parts.join(' ');
    }

    return fmtData;
  };

  for (let name of names) {
    let metric = data.metrics[name];
    var mark = ' ';
    var markColor = function (text) {
      return text;
    }; // noop

    if (metric.thresholds) {
      mark = succMark;
      markColor = function (text) {
        return decorate(text, palette.green);
      };
      forEach(metric.thresholds, function (name, threshold) {
        if (!threshold.ok) {
          mark = failMark;
          markColor = function (text) {
            return decorate(text, palette.red);
          };
          return true; // break
        }
      });
    }
    let fmtIndent = indentForMetric(name);
    let fmtName = displayNameForMetric(name);
    fmtName += decorate('.'.repeat(nameLenMax - strWidth(fmtName) - strWidth(fmtIndent) + 3) + ':', palette.faint);

    result.push(indent + fmtIndent + markColor(mark) + ' ' + fmtName + ' ' + getData(name));
  }

  return result;
}

function generateTextSummary(data, options) {
  let mergedOpts = { ...defaultOptions, ...data.options, ...options };
  let lines = [];

  // TODO: move all of these functions into an object with methods?
  let decorate = function (text) {
    return text;
  };
  if (mergedOpts.enableColors) {
    decorate = function (text, color /* , ...rest */) {
      let result = '\x1b[' + color;
      for (let i = 2; i < arguments.length; i++) {
        result += ';' + arguments[i];
      }
      return result + 'm' + text + '\x1b[0m';
    };
  }

  Array.prototype.push.apply(lines, summarizeGroup(mergedOpts.indent + '    ', data.root_group, decorate));

  Array.prototype.push.apply(lines, summarizeMetrics(mergedOpts, data, decorate));

  return lines.join('\n');
}

let replacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
};

function escapeHTML(str) {
  // TODO: something more robust?
  return str.replace(/[&<>'"]/g, function (char) {
    return replacements[char];
  });
}

function generateJUnitXML(data, options) {
  let failures = 0;
  let cases = [];

  forEach(data.metrics, function (metricName, metric) {
    if (!metric.thresholds) {
      return;
    }
    forEach(metric.thresholds, function (thresholdName, threshold) {
      if (threshold.ok) {
        cases.push('<testcase name="' + escapeHTML(metricName) + ' - ' + escapeHTML(thresholdName) + '" />');
      } else {
        failures++;
        cases.push(
          '<testcase name="'
            + escapeHTML(metricName)
            + ' - '
            + escapeHTML(thresholdName)
            + '"><failure message="failed" /></testcase>',
        );
      }
    });
  });

  let name = options && options.name ? escapeHTML(options.name) : 'k6 thresholds';

  return (
    '<?xml version="1.0"?>\n<testsuites tests="'
    + cases.length
    + '" failures="'
    + failures
    + '">\n'
    + '<testsuite name="'
    + name
    + '" tests="'
    + cases.length
    + '" failures="'
    + failures
    + '">'
    + cases.join('\n')
    + '\n</testsuite >\n</testsuites >'
  );
}

exports.humanizeValue = humanizeValue;
exports.textSummary = generateTextSummary;
exports.jUnit = generateJUnitXML;
/* eslint-enable */

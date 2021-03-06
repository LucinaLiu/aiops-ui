import moment from 'moment';
import { useState, useCallback, useMemo } from 'react';
import { Duration, Step } from '@/components/Dashboard/type';

const steps = [Step.MONTH, Step.DAY, Step.HOUR, Step.MINUTE];

const pattern = {
  MONTH: 'YYYY-MM',
  DAY: 'YYYY-MM-DD',
  HOUR: 'YYYY-MM-DD HH',
  MINUTE: 'YYYY-MM-DD HHmm',
};

export function getDuration([fromMoment, toMoment]): Duration {
  const diff = moment.duration(toMoment.diff(fromMoment));
  for (let index = 0; index < steps.length; index++) {
    const step = steps[index];
    const count = diff[`as${step[0] + step.slice(1).toLowerCase()}s`]();
    if (count >= 4 || index === steps.length - 1) {
      return {
        start: fromMoment.format(pattern[step]),
        end: toMoment.format(pattern[step]),
        step,
      };
    }
  }
}

export function useDuration(init = [moment().subtract(15, 'm'), moment()]) {
  const { start, end, step } = init;
  let initRange = init;
  if (start && end && step) {
    initRange = [moment(start, pattern[step]), moment(end, pattern[step])];
  }
  const [range, setRange] = useState(initRange);

  const duration = useMemo(() => {
    return getDuration(range);
  }, [range]);

  const refresh = useCallback(() => {
    setRange(range => {
      const [fromMoment, toMoment] = range;
      const delta = moment.duration(moment().diff(toMoment));
      return [moment(fromMoment).add(delta), moment(toMoment).add(delta)];
    });
  }, []);

  const changeDuration = useCallback(([newFromMoment, newToMoment]) => {
    setRange(range => {
      const [fromMoment, toMoment] = range;
      if (fromMoment.isSame(newFromMoment) && toMoment.isSame(newToMoment)) {
        return range;
      } else {
        return [newFromMoment, newToMoment];
      }
    });
  }, []);
  return { duration, range, refresh, changeDuration };
}

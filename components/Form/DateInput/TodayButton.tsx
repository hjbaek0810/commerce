import { getDate, getMonth, getYear } from 'date-fns';

import Button from '@components/Button';

const TodayButton = () => {
  const today = new Date();

  return (
    <Button size="medium" fill fullWidth>
      Today: {`${getYear(today)}-${getMonth(today) + 1}-${getDate(today)}`}
    </Button>
  );
};

export default TodayButton;

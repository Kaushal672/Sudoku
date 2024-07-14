import { FC, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';

import classes from './Timer.module.css';

type TimerProps = {
    timeStamp: Date;
    stopGame: () => void;
};

const Timer: FC<TimerProps> = ({ timeStamp, stopGame }) => {
    const { minutes, seconds, start } = useTimer({
        expiryTimestamp: timeStamp,
        onExpire: stopGame,
    });

    useEffect(() => {
        start();
    }, []);

    return (
        <div className={classes['timer-container']}>
            <h3>
                {`${minutes}`.padStart(2, '0')}:{`${seconds}`.padStart(2, '0')}
            </h3>
        </div>
    );
};

export default Timer;

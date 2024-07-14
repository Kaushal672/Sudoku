import { FC } from 'react';
import ReactDOM from 'react-dom';
import classes from './Modal.module.css';

const Modal: FC<{
    score: number;
    onClose: () => void;
}> = ({ score, onClose }) => {
    const overlayRoot = document.getElementById('overlay-root');
    const backdropRoot = document.getElementById('backdrop-root');
    if (!overlayRoot || !backdropRoot) return null;
    return (
        <>
            {ReactDOM.createPortal(
                <div className={classes['backdrop']} onClick={onClose}></div>,
                backdropRoot
            )}
            {ReactDOM.createPortal(
                <>
                    <div className={classes['results-summary-container']}>
                        <div className={classes.confetti}>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                            <div className={classes['confetti-piece']}></div>
                        </div>
                        <div
                            className={
                                classes['results-summary-container__result']
                            }
                        >
                            <div className={classes['heading-tertiary']}>
                                Your Score
                            </div>
                            <div className={classes['result-box']}>
                                <div className={classes['heading-primary']}>
                                    {score}
                                </div>
                            </div>
                            <div className={classes['result-text-box']}>
                                <div className={classes['heading-secondary']}>
                                    excellent
                                </div>
                                <p className={classes.paragraph}>
                                    Congratulations! You&apos;ve successfully
                                    completed the Sudoku puzzle!
                                </p>
                            </div>
                            <div className={classes['summary__cta']}>
                                <button
                                    className={`${classes.btn} ${classes['btn__continue']}`}
                                    onClick={onClose}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </>,
                overlayRoot
            )}
        </>
    );
};

export default Modal;

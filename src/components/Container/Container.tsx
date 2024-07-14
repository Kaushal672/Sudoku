import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import {
    FC,
    useEffect,
    useState,
    ChangeEvent,
    useReducer,
    Reducer,
} from 'react';

import SudokuBoard, { Difficulty } from '../../helper/Board';
import Timer from '../Timer/Timer';
import Modal from '../Modal/Modal';
import Board from '../Board/Board';
import classes from './Container.module.css';

export type State = {
    showHint: boolean;
    hintBoard: boolean[][];
};

const timeStamps = {
    easy: 5,
    medium: 10,
    hard: 15,
};

const getInitialBoard = (): number[][] =>
    Array.from({ length: 9 }, () => Array(9).fill(0)).slice();

type Action = { type: 'SHOW'; hintBoard: boolean[][] } | { type: 'HIDE' };

const initialState: State = {
    showHint: false,
    hintBoard: Array.from({ length: 9 }, () => Array(9).fill(false)),
};

const hintBoardReducer = (state: State, action: Action): State => {
    if (action.type === 'SHOW') {
        return { showHint: true, hintBoard: [...action.hintBoard] };
    } else if (action.type === 'HIDE') {
        return { showHint: false, hintBoard: [...state.hintBoard] };
    }

    return state;
};

const Container: FC = () => {
    const [board, setBoard] = useState<number[][]>(getInitialBoard());
    const [startingBoard, setStartingBoard] =
        useState<number[][]>(getInitialBoard());
    const [fullBoard, setFullBoard] = useState<number[][]>(getInitialBoard());
    const [difficulty, setDifficulty] = useState<keyof Difficulty>('easy');
    const [showModal, setShowModal] = useState<boolean>(false);

    const [hintState, dispatch] = useReducer<Reducer<State, Action>>(
        hintBoardReducer,
        initialState
    );

    const [gameStart, setGameStart] = useState<boolean>(false);

    const [highScore, setHighScore] = useState<number>(0);
    const [curScore, setCurScore] = useState<number>(0);

    useEffect(() => {
        if (SudokuBoard.check(board, fullBoard) && gameStart) {
            completeGame();
        }
    }, [board]);

    const updateCell = (
        rowIndex: number,
        colIndex: number,
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const value = +e.target.value;
        if (!isNaN(value) && value >= 1 && value <= 9) {
            setBoard((prevBoard) => {
                const newBoard = prevBoard.map((row, i) =>
                    row.map((cell, j) =>
                        i === rowIndex && j === colIndex ? value : cell
                    )
                );
                return newBoard;
            });
        } else {
            setBoard((prevBoard) => {
                const newBoard = prevBoard.map((row, i) =>
                    row.map((cell, j) =>
                        i === rowIndex && j === colIndex ? 0 : cell
                    )
                );
                return newBoard;
            });
        }
    };

    const buildHintBoard = (): boolean[][] => {
        const hintBoard: boolean[][] = Array.from({ length: 9 }, () =>
            Array(9).fill(false)
        );

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (fullBoard[i][j] === board[i][j]) hintBoard[i][j] = true;
            }
        }
        return hintBoard;
    };

    const handleClick = () => {
        dispatch({ type: 'SHOW', hintBoard: buildHintBoard() });

        setTimeout(
            () => {
                dispatch({ type: 'HIDE' });
            },
            (30 * 1000) / timeStamps[difficulty]
        );
    };

    const changeDifficulty = (e: ChangeEvent<HTMLSelectElement>) => {
        if (gameStart) return;
        const value = e.target.value as keyof Difficulty;
        setDifficulty(value);
    };

    const startGame = () => {
        const newBoardObj = new SudokuBoard();
        newBoardObj.fillBoard();
        newBoardObj.makeBoard(difficulty);
        setBoard(newBoardObj.getBoard());
        setStartingBoard(newBoardObj.getBoard());
        setFullBoard(newBoardObj.getFullBoard());
        dispatch({ type: 'HIDE' });
        setGameStart(true);
    };

    const resetGame = () => {
        setGameStart(false);
        setBoard(getInitialBoard());
        setStartingBoard(getInitialBoard());
        setFullBoard(getInitialBoard());
        dispatch({ type: 'HIDE' });
    };

    const stopGame = () => {
        setGameStart(false);
        dispatch({ type: 'SHOW', hintBoard: buildHintBoard() });
    };

    const completeGame = () => {
        setGameStart(false);

        dispatch({ type: 'SHOW', hintBoard: buildHintBoard() });
        let score = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                score +=
                    board[i][j] === fullBoard[i][j]
                        ? timeStamps[difficulty] * 5
                        : 0;
            }
        }
        setCurScore(score);
        setHighScore((prevState) => Math.max(prevState, score));
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className={classes.container}>
            {showModal && (
                <Modal
                    score={curScore}
                    highScore={highScore}
                    onClose={closeModal}
                ></Modal>
            )}
            {gameStart && (
                <div className={classes['game-widgets']}>
                    <Timer
                        timeStamp={
                            new Date(
                                Date.now() + timeStamps[difficulty] * 60 * 1000
                            )
                        }
                        stopGame={stopGame}
                    ></Timer>
                    <button
                        className={classes['btn-hint']}
                        onClick={handleClick}
                    >
                        <FontAwesomeIcon size="lg" icon={faLightbulb} />
                    </button>
                </div>
            )}

            <div className={classes['game-section']}>
                <div className={classes['score-board']}>
                    <h2>Score board</h2>
                    <h3>Your highest score: {highScore}</h3>
                    <p></p>
                </div>
                <Board
                    board={board}
                    startingBoard={startingBoard}
                    updateCell={updateCell}
                    hintState={hintState}
                    gameStart={gameStart}
                ></Board>
                <div className={classes.action}>
                    <button
                        className={`${classes.btn} ${classes['btn-start']}`}
                        onClick={startGame}
                        disabled={gameStart}
                    >
                        Start
                    </button>
                    <button
                        className={`${classes.btn} ${classes['btn-reset']}`}
                        onClick={resetGame}
                    >
                        Reset
                    </button>
                    <label htmlFor="difficulty">Choose Difficulty</label>
                    <select
                        name="difficulty"
                        id="difficulty"
                        defaultValue="easy"
                        onChange={changeDifficulty}
                        disabled={gameStart}
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Container;

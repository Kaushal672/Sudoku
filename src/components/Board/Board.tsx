import { ChangeEvent, FC } from 'react';
import classes from './Board.module.css';
import { State } from '../Container/Container';

type BoardProps = {
    board: number[][];
    startingBoard: number[][];
    updateCell: (
        rowIndex: number,
        colIndex: number,
        e: ChangeEvent<HTMLInputElement>
    ) => void;

    hintState: State;
    gameStart: boolean;
};

const Board: FC<BoardProps> = ({
    board,
    startingBoard,
    updateCell,
    hintState,
    gameStart,
}) => {
    const handleInput =
        (i: number, j: number) => (e: ChangeEvent<HTMLInputElement>) => {
            updateCell(i, j, e);
        };
    return (
        <table className={classes.board} border={0}>
            <tbody>
                {board.map((row, i) => (
                    <tr key={i}>
                        {row.map((cell, j) => (
                            <td key={j}>
                                {startingBoard[i][j] === 0 ? (
                                    <input
                                        type="text"
                                        maxLength={1}
                                        value={
                                            cell === 0 ? '' : cell.toString()
                                        }
                                        onChange={handleInput(i, j)}
                                        className={`${hintState.showHint ? (hintState.hintBoard[i][j] ? classes.correct : classes.wrong) : ''} `}
                                        readOnly={!gameStart}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        maxLength={1}
                                        value={cell.toString()}
                                        className={classes.filled}
                                        readOnly
                                    />
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Board;

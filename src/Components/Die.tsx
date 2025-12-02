import type { JSX } from 'react';
import type { DieProps } from '../App';

export default function Die({ id, value, isHeld, onClick }: DieProps): JSX.Element {
    const style = { backgroundColor: isHeld ? '#59E391' : 'white' };

    return (
        <button
            style={style}
            onClick={() => onClick(id)}
            aria-label={`Die with value ${value}, ${isHeld ? 'held' : 'not held'}`}
            aria-pressed={isHeld}
        >
            {value}
        </button>
    );
}

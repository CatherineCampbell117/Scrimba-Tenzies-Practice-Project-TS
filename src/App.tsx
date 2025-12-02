// 1. Imports
import { useState, useRef, useEffect } from 'react';
import './App.css';
import Die from './Components/Die';
import { nanoid } from 'nanoid';
import type { JSX } from 'react';
// 2. Helper functions (outside the component if they don't rely of component state)

/**
 * Generate an array of 10 dice objects.
 * Each die has a random value between 1 and 6. is intially not held, and has a unique ID.
 * @returns (Array) Array of dice objects with shape: { value: number, isHeld: boolean, id: string }
 */

export type DieProps = {
    id: string;
    value: number;
    isHeld: boolean;
    onClick: (id: string) => void;
};

function generateAllNewDice(): Omit<DieProps, 'onClick'>[] {
    const diceRandomNums: Omit<DieProps, 'onClick'>[] = [];

    // Create a die object with a random value (1–6), isHeld set to false, and a unique ID
    for (let i = 0; i < 10; i++) {
        const randomNum: Omit<DieProps, 'onClick'> = {
            value: Math.floor(Math.random() * 6 + 1),
            isHeld: false,
            id: nanoid()
        };
        // Add the die object to the dice array
        diceRandomNums.push(randomNum);
    }
    return diceRandomNums;
}

// 3. Main component

function App() {
    // 3a. State

    // Set dice with a state of the function that generates 10 random numbers (objects)
    const [dice, setDice] = useState(() => generateAllNewDice());

    // 3b. Derived values

    // Check if all dice have the same value and are held (used to determine win condition)
    // check if the value is equal to the first object value in the array (dice - array [0] - first object .value - the value of the first object).
    // AND check each die's isHeld property is equal to true.
    const gameWon: boolean = dice.every(die => die.value === dice[0].value && die.isHeld === true);

    // 3c. Event handlers

    /**
     * Toggles the isHeld property of a die based on its ID.
     * Used to "hold" a die so its value doesn't change on roll.
     * @param {string} id - The unique ID of the die to toggle.
     */
    function holdDice(id: string): void {
        // Update dice state: toggle isHeld for the die that matches the clicked ID
        setDice((prevDice: Omit<DieProps, 'onClick'>[]): Omit<DieProps, 'onClick'>[] =>
            prevDice.map(die => (die.id === id ? { ...die, isHeld: !die.isHeld } : die))
        );
    }

    /**
     * Rolls new dice by updating only those that are not held.
     * Held dice retain their current value.
     */
    function getNewDice(): void {
        if (gameWon === true) {
            setDice(generateAllNewDice());
        } else {
            setDice(prevDice =>
                prevDice.map(die =>
                    die.isHeld ? { ...die } : { ...die, value: Math.ceil(Math.random() * 6) }
                )
            );
        }
    }

    // 3d. JSX mapping

    console.log(generateAllNewDice());

    // Create an array of Die components from the dice state, passing props like value, isHeld, and ID
    const diceElements: JSX.Element[] = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            id={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            onClick={holdDice}
        />
    ));

    // 3e. JSX return

    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (gameWon && buttonRef.current) {
            buttonRef.current.focus();
        }
    }, [gameWon]);

    return (
        <>
            <main className="mainContent">
                <h1 className="title">Tenzies</h1>
                <p className="instructions">
                    Roll until all dice are the same. Click each die to freeze it at its current
                    value between rolls.
                </p>
                <div className="dieContainer">{diceElements}</div>
                <button className="rollBtn" onClick={getNewDice} ref={buttonRef}>
                    {gameWon ? 'New Game' : 'Roll'}
                </button>
            </main>
        </>
    );
}
export default App;

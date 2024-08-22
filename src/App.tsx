import { useReducer, useEffect } from "react";
import { db, collection, getDocs } from "./firebaseConfig";

interface State {
  input: string[];
  guesses: { letters: string[]; feedback: string[] }[];
  answer: string[];
  currentRow: number;
  isGameOver: boolean;
}

type Action =
  | { type: "ADD_LETTER"; payload: string }
  | { type: "REMOVE_LETTER" }
  | { type: "SUBMIT_GUESS" }
  | { type: "RESET_GAME"; payload: string[] };

const initialState: State = {
  input: [],
  guesses: [],
  answer: [] as string[],
  currentRow: 0,
  isGameOver: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_LETTER":
      if (state.input.length > 4) {
        return state;
      }
      if (typeof action.payload === "string") {
        return {
          ...state,
          input: [...state.input, action.payload],
        };
      }

    case "REMOVE_LETTER": {
      const inputArray = [...state.input];
      inputArray.pop();
      return {
        ...state,
        input: inputArray,
      };
    }

    case "SUBMIT_GUESS": {
      if (state.input.length !== 5) {
        return state;
      }
      const guessFeedback = getFeedbackColor(state.input, state.answer);
      const isCorrect = state.input.join("") === state.answer.join("");
      return {
        ...state,
        guesses: [
          ...state.guesses,
          { letters: state.input, feedback: guessFeedback },
        ],
        input: [],
        currentRow: state.currentRow + 1,
        isGameOver: isCorrect || state.currentRow >= 5,
      };
    }

    case "RESET_GAME":
      return {
        ...initialState,
        answer: action.payload as string[],
      };

    default:
      return state;
  }
}

function getFeedbackColor(input: string[], answer: string[]): string[] {
  return input.map((letter, index) => {
    if (answer[index] === letter) {
      return "bg-green-100";
    }
    if (answer.includes(letter)) {
      return "bg-yellow-200";
    }
    return "bg-zinc-300";
  });
}

async function getRandowWord(): Promise<string[]> {
  const wordCollection = collection(db, "words");
  const wordSnapshot = await getDocs(wordCollection);
  const wordList = wordSnapshot.docs.map((doc) => doc.data().word);
  const randomIndex = Math.floor(Math.random() * wordList.length);
  const randomWord = wordList[randomIndex];
  console.log("randomWord", randomWord);
  return randomWord.split("");
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initializeGame = async () => {
    const answer = await getRandowWord();
    dispatch({ type: "RESET_GAME", payload: answer });
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    if (state.isGameOver) {
      return;
    }
    if (event.key === "Backspace") {
      dispatch({ type: "REMOVE_LETTER" });
    }
    if (key.length === 1 && key >= "A" && key <= "Z") {
      dispatch({ type: "ADD_LETTER", payload: key });
    }
    if (event.key === "Enter") {
      dispatch({ type: "SUBMIT_GUESS" });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.isGameOver]);

  return (
    <div className="flex justify-center items-center grid-rows-6 h-screen relative">
      <div className="grid grid-cols-5 grid-rows-6 gap-6 border-solid border-neutral-950">
        {Array.from({ length: 30 }).map((_, index) => {
          const rowIndex = Math.floor(index / 5);
          const letterIndex = index % 5;
          let letter, color;
          if (rowIndex < state.guesses.length) {
            letter = state.guesses[rowIndex].letters[letterIndex];
            color = state.guesses[rowIndex].feedback[letterIndex];
          } else if (rowIndex === state.currentRow) {
            letter = state.input[letterIndex];
            color = "";
          }
          return (
            <div
              key={index}
              className={`border-[3px] p-2 text-center w-[62px] h-[62px] flex justify-center items-center text-[30px] font-medium ${color}`}
            >
              {letter}
            </div>
          );
        })}
      </div>
      {state.isGameOver && (
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <div className="bg-black bg-opacity-75 text-white text-2xl font-bold flex justify-center items-center w-[180px] h-[80px] rounded mb-10">
            {state.guesses.some(
              (guess) => guess.letters.join("") === state.answer.join("")
            )
              ? "Genius"
              : "Mulch"}
          </div>
          <button
            onClick={initializeGame}
            className="bg-slate-400 bg-opacity-75 text-white text-2xl font-bold flex justify-center items-center w-[100px] h-[50px] rounded cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

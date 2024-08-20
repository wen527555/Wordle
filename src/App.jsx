import { useReducer, useEffect } from "react";

const initialState = {
  input: [],
  guesses: [],
  answer: ["D", "E", "L", "A", "Y"],
  currentRow: 0,
  isGameOver: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_LETTER":
      return {
        ...state,
        input: [...state.input, action.payload],
      };
    case "REMOVE_LETTER":
      return {
        ...state,
        input: state.input.slice(0, -1),
      };
    case "SUBMIT_GUESS":
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
        isGameOver: isCorrect ? true : false,
      };
    default:
      return state;
  }
}

function getFeedbackColor(input, answer) {
  return input.map((letter, index) => {
    if (answer[index] === letter) {
      return "bg-green-500";
    } else if (answer.includes(letter)) {
      return "bg-yellow-200";
    } else {
      return "bg-neutral-400";
    }
  });
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const handleKeyDown = (event) => {
    if (state.isGameOver) return;
    const key = event.key.toUpperCase();
    if (event.key === "Backspace") {
      dispatch({ type: "REMOVE_LETTER" });
    }
    if (key.length === 1 && key >= "A" && key <= "Z") {
      if (state.input.length < 5) {
        dispatch({ type: "ADD_LETTER", payload: key });
      }
    }
    if (event.key === "Enter" && state.input.length === 5) {
      dispatch({ type: "SUBMIT_GUESS" });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="flex justify-center items-center grid-rows-6 h-screen relative">
      <div className="grid grid-cols-5 grid-rows-6 gap-6 border-solid border-neutral-950">
        {Array.from({ length: 30 }).map((_, index) => {
          const rowIndex = Math.floor(index / 5);
          const letterIndex = index % 5;
          let letter, color;
          if (rowIndex < state.guesses.length) {
            console.log("rowIndex", rowIndex);
            console.log("state.guesses.length", state.guesses);
            console.log("letterIndex", letterIndex);
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
              {letter !== undefined ? letter : ""}
            </div>
          );
        })}
      </div>
      {state.isGameOver && (
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="bg-black text-white text-2xl font-bold flex justify-center items-center w-[150px] h-[50px] rounded">
            Genius!
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

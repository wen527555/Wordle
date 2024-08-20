import { useReducer } from "react";
import "./App.css";

const initialState = {
  input: [],
  guesses: [],
  answer: [],
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
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log("state", state);
  const handleKeyDown = (event) => {
    const key = event.key.toUpperCase();
    if (event.key === "Backspace") {
      dispatch({ type: "REMOVE_LETTER" });
    } else if (key.length === 1 && key >= "A" && key <= "Z") {
      if (state.input.length < 5) {
        dispatch({ type: "ADD_LETTER", payload: key });
      }
    }
  };
  return (
    <div
      className="flex justify-center items-center grid-rows-6 h-screen "
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="grid grid-cols-5 grid-rows-6  gap-6 border-solid border-neutral-950">
        {Array.from({ length: 30 }).map((_, index) => (
          <div
            key={index}
            className="border-[3px] p-2 text-center w-[62px] h-[62px] flex justify-center items-center"
          >
            {state.input[index] || ""}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

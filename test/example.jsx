import React from "react";

function TestComponent({ data }) {
  const breakIn = (id) => {
    console.log("Breaking in with ID:", id);
  };

  // This will trigger the ESLint rule - wrong formatting
  const badExample = () => {
    return (
      <button
        disabled={!!data?.clockOut}
        onClick={async () => {
          breakIn(data?.id ?? "");
        }}
      >
        Break in
      </button>
    );
  };

  // This follows the ESLint rule - correct formatting
  const goodExample = () => {
    return (
      <button
        disabled={!!data?.clockOut}
        onClick={async () => {
          breakIn(data?.id ?? "");
        }}
      >
        Break in
      </button>
    );
  };

  return (
    <div>
      {badExample()}
      {goodExample()}
    </div>
  );
}

export default TestComponent;

import React from "react";

function BadExample({ data }) {
  const breakIn = (id) => {
    console.log("Breaking in with ID:", id);
  };

  // This should trigger ESLint errors - incorrect format
  return (
    <button
      disabled={!!data?.clockOut}
      onClick={async () => {
        return breakIn(data?.id ?? "");
      }
      }
    >
      Break in
    </button>
  );
}

export default BadExample;

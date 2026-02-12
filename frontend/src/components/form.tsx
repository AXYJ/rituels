"use client";

export default function Form() {
  return (
    <>
      <ul id="messages"></ul>
      <form id="form" action="">
        <input id="input" autoComplete="off" />
        <button>Send</button>
      </form>
    </>
  );
}

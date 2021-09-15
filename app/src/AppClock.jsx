import React, { useState, useEffect } from "react";
import { GET_CLOCK_INFO_URL } from "./constants";

async function fetchAppClockInfo() {
  const response = await fetch(GET_CLOCK_INFO_URL);
  return await response.json();
}

function AppClock({ interval }) {
  const [time, setTime] = useState(null);
  const [speed, setSpeed] = useState(null);

  // Set initial state on mount
  useEffect(() => {
    fetchAppClockInfo().then((info) => {
      setTime(info.time);
      setSpeed(info.speed);
    });
  }, []);

  // Refresh state on interval
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAppClockInfo().then((info) => {
        setTime(info.time);
        setSpeed(info.speed);
      });
    }, interval);
    return () => clearTimeout(timeout);
  }, [interval, time, speed]);

  return (
    <>
      <h2>App Clock</h2>
      <h3>Time: {Math.round(time)} seconds</h3>
      <h3>Speed: {Math.round(speed)} x the speed of real time</h3>
    </>
  );
}

export default AppClock;

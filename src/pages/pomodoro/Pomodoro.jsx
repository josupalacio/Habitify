import React, { createContext, useState, useContext, useRef, useEffect } from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
//import { ThemeContext } from "../../App";
import 'react-circular-progressbar/dist/styles.css';
import "./Pomodoro.css";

{/* PlayButton & PauseButton*/ }
import { IoIosPlay } from "react-icons/io";
import { IoPauseOutline } from "react-icons/io5";
import { TbArrowBackUp } from "react-icons/tb";
import { TfiBackRight } from "react-icons/tfi";
const SettingsContext = createContext();

{/* Sliders imports */ }
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value) {
  return `${value}ºC`;
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const paddedSecs = secs < 10 ? "0" + secs : secs;

  if (hrs > 0) {
    // si hay horas, mostramos H:MM:SS
    const paddedMins = mins < 10 ? "0" + mins : mins;
    return `${hrs}:${paddedMins}:${paddedSecs}`;
  } else {
    // menos de 1 hora, MM:SS
    const paddedMins = mins < 10 ? "0" + mins : mins;
    return `${paddedMins}:${paddedSecs}`;
  }
}

const Pomodoro = () => {
  const [workMinutes, setWorkMinutes] = useState(45);
  const [breakMinutes, setBreakMinutes] = useState(15);
  const [rounds, setRounds] = useState(3);
  const [showSettings, setShowSettings] = useState(false);

  const PlayButton = (props) => (
    <button className="circle-button" {...props}>
      <span role="img" aria-label="play">
        <IoIosPlay size={32} color="black" />
      </span>
    </button>
  );
  const PauseButton = (props) => (
    <button className="circle-button" {...props}>
      <span role="img" aria-label="pause">
        <IoPauseOutline size={32} color="black" />
      </span>
    </button>
  );
  const BackButton = (props) => (
    <button className="back-button" {...props}>
      <span role="img" aria-label="back">
        <TfiBackRight />
      </span>
    </button>
  );

  const Timer = () => {
    const settingsInfo = useContext(SettingsContext);
    // const { theme } = useContext(ThemeContext);
    const [isPaused, setIsPaused] = useState(true);
    const [mode, setMode] = useState("work");
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [currentRound, setCurrentRound] = useState(1); // nueva variable para rounds

    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);
    const currentRoundRef = useRef(currentRound);



    // sincronizamos refs con state
    useEffect(() => { currentRoundRef.current = currentRound; }, [currentRound]);
    useEffect(() => { secondsLeftRef.current = secondsLeft; }, [secondsLeft]);
    useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
    useEffect(() => { modeRef.current = mode; }, [mode]);

    function tick() {
      secondsLeftRef.current--;
      setSecondsLeft(secondsLeftRef.current);
    }

    function switchMode() {
      const nextMode = modeRef.current === "work" ? "break" : "work";
      const nextSeconds = (nextMode === "work" ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60;

      if (nextMode === "work") {
        if (currentRoundRef.current >= settingsInfo.rounds) {
          // terminamos todos los rounds
          setIsPaused(true);
          return;
        } else {
          setCurrentRound(prev => prev + 1);
        }
      }

      setMode(nextMode);
      modeRef.current = nextMode;
      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;
    }

    // efecto del timer
    useEffect(() => {
      // inicializamos el timer
      secondsLeftRef.current = settingsInfo.workMinutes * 60;
      setSecondsLeft(secondsLeftRef.current);

      const interval = setInterval(() => {
        if (isPausedRef.current) return;
        if (secondsLeftRef.current <= 0) return switchMode();
        tick();
      }, 1000);

      return () => clearInterval(interval);
    }, [settingsInfo]);

    const totalSeconds = mode === "work" ? settingsInfo.workMinutes * 60 : settingsInfo.breakMinutes * 60;
    const percentage = Math.round((secondsLeft / totalSeconds) * 100);
    const minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft % 60;
    if (seconds < 10) seconds = "0" + seconds;

    return (
      <div className="container-pomodoro">
        <div className="wrapper">
          <div className="pomodoro-header">
            <div className="title">
              <p>Pomodoro Timer</p>
            </div>
          </div>
          <div className="pomodoro-body">
            <div className="progress">
              <div
                onClick={() => { if (isPaused) settingsInfo.setShowSettings(true); }}
                style={{ cursor: isPaused ? "pointer" : "default", userSelect: "none" }}
              >
                <CircularProgressbar
                  value={percentage}
                  text={formatTime(secondsLeft)}
                  styles={buildStyles({
                    textColor: "#000000",
                    pathColor: mode === "work" ? "#A2D2FF" : "#4aec8c",
                    trailColor: "rgba(255,255,255,.2)"
                  })}
                />
                <p className="current-round-info">Round: {currentRound} / {settingsInfo.rounds}</p>
              </div>
            </div>
            <div className="controls">
              {isPaused
                ? <PlayButton onClick={() => { setIsPaused(false); isPausedRef.current = false; }} />
                : <PauseButton onClick={() => { setIsPaused(true); isPausedRef.current = true; }} />}
              <BackButton
                onClick={() => {
                  // reiniciamos timer, rounds y modo
                  setSecondsLeft(settingsInfo.workMinutes * 60);
                  secondsLeftRef.current = settingsInfo.workMinutes * 60;
                  setMode("work");
                  modeRef.current = "work";
                  setCurrentRound(1);
                  currentRoundRef.current = 1;
                  setIsPaused(true); // opcional, pausa para ver los cambios
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Settings = () => {
    const settingsInfo = useContext(SettingsContext);
    return (
      <div className="container-pomodoro">
        <div className="wrapper">
          <div className="pomodoro-header">
            <div className="title">
              <p>Ajustes</p>
            </div>
          </div>
          <div className="pomodoro-settings-body">
            <div className="settings-content">
              <div className="box-sliders">
                {/* Work */}
                <p>Work: {workMinutes} min</p>
                <Box sx={{ width: 300 }}>
                  <Slider
                    defaultValue={workMinutes}
                    onChangeCommitted={(e, val) => setWorkMinutes(val)}
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={10}
                    max={90}
                  />
                </Box>

                {/* Break */}
                <p>Break: {breakMinutes} min</p>
                <Box sx={{ width: 300 }}>
                  <Slider
                    defaultValue={breakMinutes}
                    onChangeCommitted={(e, val) => setBreakMinutes(val)}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={5}
                    max={30}
                  />
                </Box>

                {/* Rounds */}
                <p>Rounds: {rounds}</p>
                <Box sx={{ width: 300 }}>
                  <Slider
                    defaultValue={rounds}
                    onChangeCommitted={(e, val) => setRounds(val)}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={5}
                  />
                </Box>
              </div>
              <div className="settings-controls">
                <BackButton
                  onClick={() => {
                    // Cerramos la pantalla de ajustes
                    settingsInfo.setShowSettings(false);

                    // Reiniciamos timer, rounds y modo
                    setSecondsLeft(workMinutes * 60);
                    secondsLeftRef.current = workMinutes * 60;
                    setMode("work");
                    modeRef.current = "work";
                    setCurrentRound(1);
                    setIsPaused(true); // opcional
                  }}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pomodoro-container">
      <SettingsContext.Provider value={{
        showSettings,
        setShowSettings,
        workMinutes,
        breakMinutes,
        rounds,
        setWorkMinutes,
        setBreakMinutes,
        setRounds
      }}>
        {showSettings ? <Settings /> : <Timer />}
      </SettingsContext.Provider>
    </div>
  );
};

export default Pomodoro;
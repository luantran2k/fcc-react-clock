import {
    store,
    increaseAction,
    decreaseAction,
    runningAction,
    resetDefaultAction,
    resetSecondAction,
} from "./ReduxStore.js";
const { useState, useEffect } = React;
const { Provider, connect } = ReactRedux;

function Timer(props) {
    useEffect(() => {
        let secondsInterval;
        if (props.running) {
            secondsInterval = setInterval(() => {
                // console.log(`${props.minutes}:${props.seconds}`);
                if (props.minutes == 0 && props.seconds == 0) {
                    document.getElementById("beep").play();
                    props.playPauseCLick();
                } else {
                    props.decrease("seconds");
                }
            }, 1000);
        }
        return () => {
            clearInterval(secondsInterval);
        };
    }, [props.running, props.seconds]);

    const handleReset = () => {
        props.resetDefault();
        document.getElementById("beep").pause();
        document.getElementById("beep").currentTime = 0;
    };

    return (
        <div id="timer">
            <p id="timer-label">Session</p>
            <p id="time-left">
                {("0" + props.minutes).slice(-2)}:
                {("0" + props.seconds).slice(-2)}
            </p>
            <div className="clock-control">
                <audio id="beep" src="./beep.wav"></audio>
                <div
                    id="start_stop"
                    className={`button ${props.running ? "active" : ""}`}
                    onClick={props.playPauseCLick}
                >
                    <ion-icon
                        id="start"
                        name="caret-forward-circle-outline"
                    ></ion-icon>
                    <ion-icon id="stop" name="pause-circle-outline"></ion-icon>
                </div>
                <div onClick={handleReset}>
                    <ion-icon
                        id="reset"
                        className="button"
                        name="refresh-outline"
                    ></ion-icon>
                </div>
            </div>
        </div>
    );
}

const TimerConnected = connect(
    (state) => ({
        sessionLength: state.sessionLength,
        minutes: state.minutes,
        seconds: state.seconds,
        running: state.running,
    }),
    (dispatch) => ({
        playPauseCLick: () => {
            dispatch(runningAction());
        },
        decrease: (stateName) => {
            dispatch(decreaseAction(stateName));
        },
        resetDefault: () => {
            dispatch(resetDefaultAction());
        },
        resetSecond: () => {
            dispatch(resetSecondAction());
        },
    })
)(Timer);

function TimeBlock(props) {
    const handleIncrease = (event) => {
        if (props.running) {
            return;
        }
        props.increase(props.name);
    };
    const handleDecrease = (event) => {
        if (props.running) {
            return;
        }
        props.decrease(props.name);
    };

    return (
        <div className="time-block">
            <p className="label" id={props.idLabel}>
                {props.label}
            </p>
            <div className="time-control">
                <div
                    onClick={handleDecrease}
                    id={props.idDecrement}
                    className="button"
                >
                    <ion-icon name="arrow-down-outline"></ion-icon>
                </div>
                <p className="time-length" id={props.idLength}>
                    {props[props.name]}
                </p>
                <div
                    onClick={handleIncrease}
                    id={props.idIncrement}
                    className="button "
                >
                    <ion-icon name="arrow-up-outline"></ion-icon>
                </div>
            </div>
        </div>
    );
}

const TimeBlockConnected = connect(
    (state) => ({
        breakLength: state.breakLength,
        sessionLength: state.sessionLength,
        running: state.running,
    }),
    (dispatch) => ({
        increase: (stateName) => {
            dispatch(increaseAction(stateName));
        },
        decrease: (stateName) => {
            dispatch(decreaseAction(stateName));
        },
    })
)(TimeBlock);

function App(props) {
    return (
        <div id="clock">
            <div className="time-blocks">
                <TimeBlockConnected
                    name="breakLength"
                    label="Break Length"
                    idLabel="break-label"
                    idDecrement="break-decrement"
                    idIncrement="break-increment"
                    idLength="break-length"
                />
                <TimeBlockConnected
                    name="sessionLength"
                    label="Session Length"
                    idLabel="session-label"
                    idDecrement="session-decrement"
                    idIncrement="session-increment"
                    idLength="session-length"
                />
            </div>
            <TimerConnected />
        </div>
    );
}

function AppWrapper(props) {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppWrapper />);

const INCREASE = "INCREASE";
const DECREASE = "DECREASE";
const RUNNING = "RUNNING";
const RESET_DEFAULT = "RESET_DEFAULT";
const RESET_SECONDS = "RESET_SECONDS";

export const increaseAction = (stateName) => ({
    type: INCREASE,
    stateName,
});

export const decreaseAction = (stateName) => ({
    type: DECREASE,
    stateName,
});

export const runningAction = () => ({
    type: RUNNING,
});

export const resetDefaultAction = () => ({
    type: RESET_DEFAULT,
});

export const resetSecondAction = () => ({
    type: RESET_SECONDS,
});

const defaultState = {
    breakLength: 5,
    sessionLength: 25,
    minutes: 25,
    seconds: 0,
    running: false,
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case RESET_DEFAULT:
            return { ...defaultState };
        case INCREASE:
            if (action.stateName == "sessionLength") {
                if (state.sessionLength < 60) {
                    return {
                        ...state,
                        [action.stateName]: ++state[action.stateName],
                        minutes: state.sessionLength,
                    };
                }
                return {
                    ...state,
                };
            } else if (action.stateName == "breakLength") {
                if (state.breakLength < 60) {
                    return {
                        ...state,
                        [action.stateName]: ++state[action.stateName],
                    };
                }
                return {
                    ...state,
                };
            }
            return {
                ...state,
                [action.stateName]: ++state[action.stateName],
            };
        case DECREASE:
            if (action.stateName == "sessionLength") {
                if (state.sessionLength > 1) {
                    return {
                        ...state,
                        [action.stateName]: --state[action.stateName],
                        minutes: state.sessionLength,
                    };
                }
                return {
                    ...state,
                };
            } else if (action.stateName == "breakLength") {
                if (state.breakLength > 1) {
                    return {
                        ...state,
                        [action.stateName]: --state[action.stateName],
                    };
                }
                return {
                    ...state,
                };
            } else if (action.stateName == "seconds" && state.seconds == 0) {
                return {
                    ...state,
                    seconds: 59,
                    minutes: --state.minutes,
                };
            } else {
                return {
                    ...state,
                    [action.stateName]: --state[action.stateName],
                };
            }
        case RUNNING:
            return {
                ...state,
                running: !state.running,
            };
        case RESET_SECONDS:
            return {
                ...state,
                seconds: 59,
            };
        default:
            return { ...state };
    }
};

export const store = Redux.createStore(reducer);

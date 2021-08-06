const eventsModule = (function(){
    let events = {};

    function on(eventName, fn){
        events[eventName] = events[eventName] || [];
        events[eventName].push(fn);
    }

    function off(eventName, fn) {
        if (events[eventName]) {
            for (let i = 0; i < events[eventName].length; i++) {
                if(events[eventName][i] === fn) {
                    events[eventName].splice(i, 1);
                    break;
                }
            };
        }
    }

    function emit (eventName, data) {
        let x = false;
        if(arguments.length > emit.length) {
            data = [...arguments].slice(1);
            x = true;
        }
        if(events[eventName] && !x) {
            events[eventName].forEach(fn => fn(data));
        }
        if(events[eventName] && x) {
            events[eventName].forEach(fn => fn(...data));
        }
    }

    return {
        on,
        off,
        emit
    }
}());

export default eventsModule
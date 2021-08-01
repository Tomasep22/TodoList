const eventsModule = (function(){
    let events = {};

    function on(eventName, fn){
        events[eventName] = events[eventName] || []
        events[eventName].push(fn);
    }

    function emit (eventName, data) {
        let x = false
        if(arguments.length > emit.length) {
            data = [...arguments].slice(1)
            x = true
        }
        if(events[eventName] && !x) {
            events[eventName].forEach(fn => fn(data))
        }
        if(events[eventName] && x) {
            events[eventName].forEach(fn => fn(...data))
        }
    }

    return {
        on,
        emit
    }
}());

export default eventsModule
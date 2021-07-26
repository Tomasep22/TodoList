import tasksModule from './tasks.js'
import domModule from './index.js'

const eventsModule = (function(){
    let events = {};

    function on(eventName, fn){
        events[eventName] = events[eventName] || []
        events[eventName].push(fn);
    }

    function emit (eventName, data) {
        if(events[eventName]) {
            events[eventName].forEach(fn => fn(data))
        }
    }

    return {
        on,
        emit
    }
}());


export default eventsModule
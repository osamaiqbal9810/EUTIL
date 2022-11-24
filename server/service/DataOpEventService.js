const EventEmitter = require('events');
let ServiceLocator = require('../framework/servicelocator');

export default class DataOpEventService extends EventEmitter {
    // constructor()
    // {
    //     this.eventHandlers = new Map();
    // }

    // addCallback(listName, eventType, callback)
    // {
    //     let criteria = listName + '=>' + eventType;
    //     // add to list per criteria
    //     let eList = this.eventHandlers.get(criteria);
    //     if(!eList)
    //     {
    //         eList=[];
    //     }
    //     eList.push(callback);
    //     this.eventHandlers.set(criteria, eList);
    // }

    // async trigger(listName, eventType, data)
    // {
    //     let criteria = listName + '=>' + eventType;
    //     //console.log('Triggered: '+ criteria);

    //     if(this.eventHandlers.has(criteria))
    //     {
    //         let handlers = this.eventHandlers.get(criteria);
    //         //console.log('Triggered: '+ criteria + ' exists, count: '+ handlers.length);
    //         for(let i=0; i<handlers.length; i++)
    //         {
    //             let cb=handlers[i];
    //             if(cb && typeof cb === 'function')
    //             {
    //                 //console.log('calling cb');
    //                 await cb(data);
    //             }
    //             else
    //             {
    //                 //console.log('not a function its: '+ typeof cb);
    //             }
                
    //         }
    //     }        
    //     // todo : check for Any any
    //   }


}

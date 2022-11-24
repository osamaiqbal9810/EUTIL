import moment from 'moment-timezone';


export const getTimeZones = () => {
    return moment.tz.names().map(name => ({text: name, val: name}));
};


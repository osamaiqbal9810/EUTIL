var _ = require('lodash');
var turf = require("@turf/turf");

class RouteSolver{
    constructor()
    {
        this.features=[];
        this.segments=[];
    }
    setFeaturesCollection(features)
    {
        let segments=[];
        if(features && features.length)
        {
            for(let feature of features)
            {
                let coordinates = this.getCoordinates(feature);
                segments.push({start: coordinates[0], end: coordinates[coordinates.length-1], coordinates: coordinates});
            }
        }
    
        if(segments && segments.length && segments.length>1)
        {
            // load segments 
            let index=0;
            for(let segment of segments)
            {
                let seg = new Segment(index, segment.start, segment.end, segment.coordinates);
                this.segments.push(seg);
                index++;
            }
        }
        else
        {
            console.log('Route solver error: segments provided are not valid.');
        }
        
        this.features = features;
    }
    extractContinuousRoute(features)
    {
        //
        // Each segment will have two endpoints, "endpoint1" and "endpoint2"
        // Find the segment connections —endpoints linked with other endpoints
        // Store connected segment number and endpoint number connected to 
        // Find the end segments (the one with no connection on one side)
        // Find excluded segments —segments that are not connected to any other.
        //
        
        this.features=[];
        this.segments=[];
        this.setFeaturesCollection(features)

        let featuresToReturn = [];

        for(let segment of this.segments)
        {
            let endpointsToProcess = [segment.ep1, segment.ep2];
            
            let i=0;
            for(let ep of endpointsToProcess)
            {
                let connections = this.findConnections(ep, segment.id);
                if(connections && connections.length && connections.length===1)
                {
                   if(i===0)
                        segment.setEp1Connection({segmentNumber: connections[0].segmentNumber, epNumber: connections[0].epNumber});
                    else
                        segment.setEp2Connection({segmentNumber: connections[0].segmentNumber, epNumber: connections[0].epNumber});
                }
                else
                {
                    if(connections && connections.length && connections.length>1)
                    {
                        console.log('Multiple connections detected with a single segment.');
                        console.log('Segment:', segment.id, ' Number of connections:', connections.length);
                        console.log('Cannot continue because this is not a single continuous line. There are branches');
                        return;
                    }
                }
                
                i++;
            }
        }
        
        // process list and save disconnected individual lines
        let segmentsCopy = _.cloneDeep(this.segments);

        let dIndex = segmentsCopy.findIndex(s=>{return (!s.ep1Connection && !s.ep2Connection);});
        while(dIndex !== -1)
        {   
            let f = this.makeFeatureFromCoordinates(segmentsCopy[dIndex].data);
            featuresToReturn.push(f);
            segmentsCopy.splice(dIndex, 1);

            dIndex = segmentsCopy.findIndex(s=>{return (!s.ep1Connection && !s.ep2Connection);});
        }
        
        // process for continuous connected features to merge them
        let remainingList = segmentsCopy, continuousLine=[];
        while(remainingList.length)
        {
            let remaining = this.processSegments(remainingList);
            
            remainingList = remaining.remainingList;
            continuousLine = remaining.continuousLine;
            let f = this.makeFeatureFromSegments(continuousLine);
            
            featuresToReturn.push(f);
        }

        return featuresToReturn;
    }
    processSegments(segments)
    {
        let segmentsCopy = _.cloneDeep(segments);
        let cLine1=[];
        // find the first point that starts a continuous line
        let start = this.findStart(segmentsCopy);
        this.deleteFromList(segmentsCopy, start.id);

        let next = start.getNext();
        let nextSegment = this.findSegment(segmentsCopy, next);
        let commingFrom = next ? next.epNumber: 0;
        if(nextSegment)
          {
              nextSegment.commingFrom = commingFrom;
              this.deleteFromList(segmentsCopy, nextSegment.id);
          }

        cLine1.push(start);
        while(next)
        {
            cLine1.push(nextSegment);
            
            if(nextSegment.isTerminalNode)
            break;

            next = nextSegment.getNext(commingFrom);
            nextSegment = this.findSegment(segmentsCopy, next);
            commingFrom = next ? next.epNumber:0;

        if(nextSegment)
          {
              this.deleteFromList(segmentsCopy, nextSegment.id);
              nextSegment.commingFrom = commingFrom;
          }
        }
        
        return {remainingList: segmentsCopy, continuousLine: cLine1};
    }
    makeFeatureFromCoordinates(coordinates)
    {
        let feature = {type:"Feature", geometry:{type:"LineString", coordinates:coordinates}};
        feature = turf.cleanCoords(feature);
        
        return feature;
    }
    makeFeatureFromSegments(segments)
    {
        let coordinates=[];

        if(segments[0].terminalEndpoint===2)
            segments[0].data.reverse().forEach(e=>{coordinates.push(e)});
        else
            segments[0].data.forEach(e=>{coordinates.push(e)});

        for(let i=1; i<segments.length; i++)
        {
            if(segments[i].commingFrom===2)
                segments[i].data.reverse().forEach(e=>{coordinates.push(e)});
            else
                segments[i].data.forEach(e=>{coordinates.push(e)});
        }

        let f = this.makeFeatureFromCoordinates(coordinates);

        return f;
    }
    findConnections(endpoint, segmentIdToIgnore)
    {
        let connections=[];
        for(let segment of this.segments)
        {
            if(segment.id===segmentIdToIgnore)
            continue;
            
            if(this.getDistance(endpoint, segment.ep1)===0)
                connections.push({segmentNumber: segment.id, epNumber:1});

            if(this.getDistance(endpoint, segment.ep2)===0)
                connections.push({segmentNumber: segment.id, epNumber:2});
        }

        return connections;
    }
    findStart(segments)
    { 
        let val = segments.find((seg)=>{return seg.isTerminalNode;});
        return val;
    }
    findSegment(segments, info)
    {
        let s = segments.find((seg)=>{return seg.id===info.id;});
        return s;
    }
    deleteFromList(segments, id)
    {
        let index = segments.findIndex((seg)=>{return seg.id===id;});
        segments.splice(index, 1);
    }
    getDistance(p0, p1)
    {
        //console.log('p0,p1:', p0, p1);
        let tp0 = turf.point(p0), tp1 = turf.point(p1);
        let distance = turf.distance(tp0, tp1);
        return distance;
    }
    getCoordinates(feature)
    {
          let returnValue=[];

                let o1 = feature.geometry;

                if(!o1)
                {
                    console.log('Feature geometry not found');
                    return returnValue;
                }
                //console.log('Feature index', fi, 'Geometry type:', o1.type);
                if(o1.type==="LineString" || o1.type==="Points")
                {
                    let coords = o1.coordinates;
                    if(!coords || !coords.length || coords.length<1)
                    {
                        console.log('Coordinates problem in feature, skipping');
                        return returnValue;
                    }
                    returnValue = coords;
                    
                }
                else
                {
                    console.log('Unknown geometry type: Only LineString and Points type geometry are processed');
                }

    return returnValue;
    }

}

class Segment {
    constructor(id, ep1, ep2, data)
    {
        this.id = id;
        this.ep1 = ep1;
        this.ep2 = ep2;
        this.ep1Connection=null;
        this.ep2Connection=null;
        this.data=data;
        this.isTerminalNode=false;
        this.terminalEndpoint=null;
        this.terminalEndpointNumber = 0;
        this.commingFrom = 0;
    }   
    setEp1Connection(ep1Connection)
    {
        this.ep1Connection = ep1Connection;
        this.calculateTerminalInfo();
    }
    setEp2Connection(ep2Connection)
    {
        this.ep2Connection = ep2Connection;
        this.calculateTerminalInfo();
    }
    setConnections(ep1Connection, ep2Connection)
    {
        this.ep1Connection = ep1Connection;
        this.ep2Connection = ep2Connection;
        this.calculateTerminalInfo();
    }
    calculateTerminalInfo()
    {
        this.isTerminalNode = !!(!this.ep1Connection && this.ep2Connection) || (this.ep1Connection && !this.ep2Connection);
        this.terminalEndpoint = null;
        if(this.isTerminalNode)
           { 
               this.terminalEndpoint = this.ep1Connection ? this.ep1:this.ep2;
               this.terminalEndpointNumber = this.ep1Connection ? 1:2;
           }
    }
    getNext(commingFrom=null)
    {
        let next=null;
        if(!commingFrom && !this.isTerminalNode)
        {
            console.log('Segment.getNext error. Please tell the direction for next element if this is not a terminal node');
            return null;
        }
        if(this.isTerminalNode)
        {
            if(this.terminalEndpointNumber===1)
                next = {id: this.ep1Connection.segmentNumber, epNumber:this.ep1Connection.epNumber};
            else if(this.terminalEndpointNumber===2)
                next = {id: this.ep2Connection.segmentNumber, epNumber:this.ep2Connection.epNumber};
        }
        else
        {
            if(commingFrom===1)    
              next = {id: this.ep2Connection.segmentNumber, epNumber: this.ep2Connection.epNumber};
            else if(commingFrom===2)
              next = {id: this.ep1Connection.segmentNumber, epNumber: this.ep1Connection.epNumber};
            else
             console.log('Segment.getNext: Error. Invalid commingFrom:', commingFrom);
        }

        return next;
    }
    getEndpointNumber(epValue)
    {
        let epNumber=0;
        if(epValue===this.ep1)
         epNumber=1;
        else if(epValue===this.ep2)    
         epNumber=2;

        return epNumber;
    }
}

module.exports = new RouteSolver();
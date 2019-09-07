class EventParser {
    constructor(sharedStore) {
        this.sharedStore = sharedStore;
    }

    parse(event) {
        let [seriesName, volumeNumber] = this.exctractEventInfo(event.name);
        let matchingSeries = this.sharedStore.series.filter(serie => serie.title.toLowerCase().indexOf(seriesName.toLowerCase()) > -1)[0];
        let matchingSerieId = matchingSeries && matchingSeries.id;
        let matchingParts = this.sharedStore.feed.filter(part => part.serieId === matchingSerieId) ;
        let matchingVolumePart = matchingParts.filter(part => this.extractVolumeNumberFromPart(part.title) === volumeNumber)[0];
        let matchingVolumePartId = matchingVolumePart && matchingVolumePart.volumeId;

        return {
            serieId: matchingSerieId,
            volumeId: matchingVolumePartId,
            preview: !matchingVolumePartId
        }
    }

    exctractEventInfo(eventName) {
        let match = /(.*?):? (?:Vol.|Volume) (\d+)/.exec(eventName);

        if(match) {
            return match.slice(1, 3);
        } else {
            console.error("Cannot parse event name", eventName);
            return ['', null];
        }
    }

    extractVolumeNumberFromPart(partName) {
        let match = /(?:.+?)(?::?)(?: Volume?) (.+) Part/.exec(partName);

        if(match) {
            return match[1];
        } else {
            console.error("Cannot extract volume number from part title", partName);
            return null;
        }
    }
}

export default EventParser;

class ReadingList {
    constructor(sharedStore, api) {
        this.sharedStore = sharedStore;
        this.api = api;

        this.readParts = {};
        this.readVolumes = {};
        this.readSeries = {};
    }

    isReadingSerie(serie) {
        return this.readSeries[serie.id] && this.readSeries[serie.id].max > 0.1;
    }

    isReadingVolume(volume) {
        return this.readVolumes[volume.id] && this.readVolumes[volume.id].max > 0.1;
    }

    isPartInFeed(part) {
        let readingSeries = this.isReadingSerie({id: part.serieId});
        if(!readingSeries) return false;

        let readingVolume = this.isReadingVolume({id: part.volumeId});
        return readingVolume || part.preview;
    }

    isReadingPart(part) {
        return this.readParts[part.id] && this.readParts[part.id].completion > 0.1 && this.readParts[part.id].completion < 0.9;
    }

    hasReadPart(part) {
        return this.readParts[part.id] && this.readParts[part.id].maxCompletion > 0.9;
    }

    seriesInReadingList() {
        return Object.keys(this.readSeries).filter((id) => !!id);
    }

    async updateFromUserDetails() {
        for(let readPart of this.sharedStore.user.readParts) {
            Vue.set(this.readParts, readPart.partId, {completion: readPart.completion, maxCompletion: readPart.maxCompletion});
            let volumeId = readPart.part && readPart.part.volumeId;
            let volumeCompletion = this.readVolumes[volumeId];
            Vue.set(this.readVolumes, volumeId, {
                min: Math.min(readPart.completion, (volumeCompletion && volumeCompletion.min) || 1),
                max: Math.max(readPart.completion, (volumeCompletion && volumeCompletion.max) || 0),
            });
            let seriesId = readPart.part && readPart.part.serieId;
            let seriesCompletion = this.readSeries[seriesId];
            Vue.set(this.readSeries, seriesId, {
                min: Math.min(readPart.completion, (seriesCompletion && seriesCompletion.min) || 1),
                max: Math.max(readPart.completion, (seriesCompletion && seriesCompletion.max) || 0),
            });
        }
        console.log(this);
    }
}

export default ReadingList;

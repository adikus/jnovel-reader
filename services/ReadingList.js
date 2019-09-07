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
        if(!part) { return false }

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
            this.updateCompletion(readPart.part, readPart.completion, readPart.maxCompletion);
        }
    }

    updateCompletion(part, completion, maxCompletion) {
        if(!part) return;
        this.updateReadPart(part.id, completion, maxCompletion);
        this.updateReadVolume(part.volumeId, completion);
        this.updateReadSeries(part.serieId, completion);
    }

    updateReadPart(partId, completion, maxCompletion) {
        if(this.readParts[partId]){
            Vue.set(this.readParts[partId], 'completion', completion);
            if(maxCompletion !== undefined){
                Vue.set(this.readParts[partId], 'maxCompletion', maxCompletion);
            }
        } else {
            Vue.set(this.readParts, partId, {completion: completion, maxCompletion: maxCompletion || completion});
        }
    }

    updateReadVolume(volumeId, completion) {
        let volumeCompletion = this.readVolumes[volumeId];
        Vue.set(this.readVolumes, volumeId, {
            min: Math.min(completion, (volumeCompletion && volumeCompletion.min) || 1),
            max: Math.max(completion, (volumeCompletion && volumeCompletion.max) || 0),
        });
    }

    updateReadSeries(serieId, completion) {
        let seriesCompletion = this.readSeries[serieId];
        Vue.set(this.readSeries, serieId, {
            min: Math.min(completion, (seriesCompletion && seriesCompletion.min) || 1),
            max: Math.max(completion, (seriesCompletion && seriesCompletion.max) || 0),
        });
    }
}

export default ReadingList;

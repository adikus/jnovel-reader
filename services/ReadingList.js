class ReadingList {
    constructor(sharedStore, api) {
        this.sharedStore = sharedStore;
        this.api = api;

        this.readParts = {};
        this.readVolumes = {};
        this.readSeries = {};
    }

    isReading(serie) {
        return this.readSeries[serie.id] && this.readSeries[serie.id].max > 0.1;
    }

    async updateFromUserDetails() {
        for(let readPart of this.sharedStore.user.readParts) {
            Vue.set(this.readParts, readPart.partId, {completion: readPart.completion, maxCompletion: readPart.maxCompletion});
            let volumeId = readPart.part && readPart.part.volumeId;
            let volumeCompletion = this.readVolumes[volumeId];
            Vue.set(this.readVolumes, volumeId, {
                min: Math.min(readPart.maxCompletion, (volumeCompletion && volumeCompletion.min) || 1),
                max: Math.max(readPart.maxCompletion, (volumeCompletion && volumeCompletion.max) || 0),
            });
            let seriesId = readPart.part && readPart.part.serieId;
            let seriesCompletion = this.readSeries[seriesId];
            Vue.set(this.readSeries, seriesId, {
                min: Math.min(readPart.maxCompletion, (seriesCompletion && seriesCompletion.min) || 1),
                max: Math.max(readPart.maxCompletion, (seriesCompletion && seriesCompletion.max) || 0),
            });
        }
        console.log(this);
    }
}

export default ReadingList;

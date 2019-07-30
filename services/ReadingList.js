class ReadingList {
    constructor(sharedStore, api) {
        this.sharedStore = sharedStore;
        this.api = api;

        this.sharedStore.retrievePartMaps();

        this.readParts = {};
        this.readVolumes = {};
        this.readSeries = {};
    }

    isReading(serie) {
        return this.readSeries[serie.id] && this.readSeries[serie.id].max > 0.1;
    }

    async updateFromUserDetails(series, doNotLoadMore) {
        let unknownPartIds = [];

        for(let readPart of this.sharedStore.user.readParts) {
            if(this.sharedStore.partSeriesMap[readPart.partId]) {
                Vue.set(this.readParts, readPart.partId, {completion: readPart.completion, maxCompletion: readPart.maxCompletion});
                let volumeId = this.sharedStore.partVolumeMap[readPart.partId];
                let volumeCompletion = this.readVolumes[volumeId];
                Vue.set(this.readVolumes, volumeId, {
                    min: Math.min(readPart.maxCompletion, (volumeCompletion && volumeCompletion.min) || 1),
                    max: Math.max(readPart.maxCompletion, (volumeCompletion && volumeCompletion.max) || 0),
                });
                let seriesId = this.sharedStore.partSeriesMap[readPart.partId];
                let seriesCompletion = this.readSeries[seriesId];
                Vue.set(this.readSeries, seriesId, {
                    min: Math.min(readPart.maxCompletion, (seriesCompletion && seriesCompletion.min) || 1),
                    max: Math.max(readPart.maxCompletion, (seriesCompletion && seriesCompletion.max) || 0),
                });
            } else {
                unknownPartIds.push(readPart.partId)
            }
        }

        if(unknownPartIds.length > 0 && !doNotLoadMore) {
            if(unknownPartIds.length > series.length) {
                await this.updatePartMaps(series);
                return await this.updateFromUserDetails(series, true);
            } else {
                for(let partId of unknownPartIds) {
                    try {
                        let partResponse = await this.api.loadPart(partId);
                        this.sharedStore.partSeriesMap[partId] = partResponse.data.serieId;
                        this.sharedStore.partVolumeMap[partId] = partResponse.data.volumeId;
                    } catch {
                        console.log(`Could load part Id ${partId}`);
                        this.sharedStore.partSeriesMap[partId] = "-1";
                        this.sharedStore.partVolumeMap[partId] = "-1";
                    }
                }
                this.sharedStore.savePartMaps();
                return await this.updateFromUserDetails(series, true);
            }
        }
        console.log(this);
    }

    async updatePartMaps(series) {
        for(let serie of series) {
            console.log(serie.title);
            let volumesResponse = await this.api.loadSerieParts(serie.id);
            let volumes = volumesResponse.data;
            for(let volume of volumes) {
                this.sharedStore.volumeSeriesMap[volume.id] = serie.id;
                for(let part of volume.parts) {
                    this.sharedStore.partSeriesMap[part.id] = serie.id;
                    this.sharedStore.partVolumeMap[part.id] = volume.id;
                }
            }
        }

        this.sharedStore.savePartMaps();
    }
}

export default ReadingList;

export default {
    template: `
    <div class="container mx-auto py-3 text-gray-700">
        <h1 class="text-2xl px-2 border-b-2 border-blue-700 mb-4">{{part.title}}</h1>
        
        <div v-html="partData" id="part-data" class="px-2"></div>
    </div>
  `,
    data() {
        return {
            partId: null,
            part: {},
            partData: ""
        }
    },
    async created() {
        let partId = this.$route.params.id;

        if(partId === "latest") {
            let partsResponse = await this.$root.api.loadSerieParts(this.$route.params.serieId);
            let volumes = partsResponse.data;
            volumes.sort((volumeA, volumeB) => volumeB.volumeNumber - volumeA.volumeNumber);
            let parts = volumes[0].parts;
            parts.sort((partA, partB) => partB.partNumber - partA.partNumber);
            this.part = parts[0];
            this.partId = this.part.id;

            console.log(this.part)
        } else {
            let partResponse = await this.$root.api.loadPart(this.$route.params.id);
            this.part = partResponse.data;
            this.partId = this.part.id;
        }

        let partDataResponse = await this.$root.api.loadPartData(this.partId);
        this.partData = partDataResponse.data.dataHTML;
    }
}

class Music {
    constructor() {
        this.audioElement = $('<audio controls type="audio/mp3">')
        this.paused = false
        this.playlist = []
        this.onMusicLoad()
        this.analyserReady = false
    }
    onMusicLoad() {
        this.audioElement.bind("canplaythrough", () => {
            try {
                console.log(this.audioElement)
                window.AudioContext = window.AudioContext || window.webkitAudioContext
                this.audioContext = new AudioContext()
                this.source = this.audioContext.createMediaElementSource(this.audioElement[0])
                this.analyser = this.audioContext.createAnalyser()
                this.source.connect(this.analyser)
                this.analyser.connect(this.audioContext.destination)
                this.analyser.fftSize = 256
                this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
                this.analyser.getByteFrequencyData(this.dataArray)
                this.analyserReady = true
                console.log(this.dataArray)
            }
            catch { }
            //visual.render()
        })
        // $(window).bind('beforeunload', () => {
        //     this.audioContext.close()
        // })
    }
    getData() {
        this.analyser.getByteFrequencyData(this.dataArray)
        return this.dataArray
    }
    play(playlist, index, pause) {
        console.log(playlist)
        this.playlist = playlist
        this.index = index
        if (pause) {
            return this.pause()
        } else {
            this.audioElement.attr("src", '/static/mp3/' + playlist[index].album + '/' + playlist[index].name)
            this.audioElement.bind("cancel", () => {
                console.log("CANCEL")
            })

            this.audioElement.bind("loadeddata", () => {
                this.audioElement.trigger("play")
                this.audioElement.bind("timeupdate", () => {
                    ui.progressBar(this.audioElement[0].duration, this.audioElement[0].currentTime)
                    ui.showTime(this.audioElement[0].duration, this.audioElement[0].currentTime)
                })
                ui.currentPlayingDisplay(playlist[index].album, playlist[index].name)
                this.paused = false
            })
            return true
        }
    }
    pause() {
        if (this.paused) {
            this.audioElement.trigger('play')
        } else {
            this.audioElement.trigger('pause')
        }
        this.paused = !this.paused
        return !this.paused
    }
    prev() {
        if (this.index == 0) this.index = this.playlist.length
        this.play(this.playlist, --this.index, false)
    }
    next() {
        if (this.index == this.playlist.length - 1) this.index = -1
        this.play(this.playlist, ++this.index, false)
    }
}

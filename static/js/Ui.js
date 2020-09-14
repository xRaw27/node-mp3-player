class Ui {
    constructor() {
        this.albums = []
        this.albumsNames = []
        this.musicLoaded = false
        this.musicLoadedAlbumIndex = null
        this.controlImgState = false
        this.setHeight()
    }
    currentPlayingDisplay(album, song) {
        $('#currentPlayingAlbum').text(this.capitalizeFirstLetter(album))
        $('#currentPlayingSong').text(this.capitalizeFirstLetter(song))
        if ($('#currentPlayingSong').text().length > 48)
            $('.marquee').marquee({ duration: 10000, gap: 50, delayBeforeStart: 1000, direction: 'left', duplicated: true, startVisible: true });
    }
    showTime(duration, currentTime) {
        if (duration) $('#duration').text(Math.floor(duration / 60) + ":" + ("0" + Math.floor(duration) % 60).slice(-2))
        if (currentTime) $('#currentTime').text(Math.floor(currentTime / 60) + ":" + ("0" + Math.floor(currentTime) % 60).slice(-2))
    }
    progressBar(duration, currentTime) {
        $('#progress').css("width", currentTime / duration * 100 + "%")
    }
    controlImg(change, play) {
        if (change) play = this.controlImgState
        $('#files').children().each((index, element) => {
            if (play) $(element).find('.rowControlImgPause').attr("src", "/static/icons/icons8-play-64.png")
            else $(element).find('.rowControlImgPause').attr("src", "/static/icons/icons8-pause-64.png")
        })
        this.controlImgState = play
    }
    pause() {
        console.log("pause")
        this.controlImg(false, true)
        $('#icon-play').css("display", "block")
        $('#icon-pause').css("display", "none")
    }
    resume() {
        console.log("resume")
        this.controlImg(false, false)
        $('#icon-play').css("display", "none")
        $('#icon-pause').css("display", "block")
    }
    setWidth() {
        let albumsWidth = 0
        $('.row').each(i => albumsWidth = Math.max(albumsWidth, $('.albumTitle')[i].offsetWidth));
        $('.row').each(i => {
            $('.albumTitle')[i].style.width = albumsWidth + "px"
            $('.fileSize')[i].style.width = albumsWidth + "px"
        });
        $(window).resize(function () {
            $('.row').each(i => {
                $('.albumTitle')[i].style.width = "auto"
                $('.fileSize')[i].style.width = "auto"
            });
            let albumsWidth = 0
            $('.row').each(i => albumsWidth = Math.max(albumsWidth, $('.albumTitle')[i].offsetWidth));
            $('.row').each(i => {
                $('.albumTitle')[i].style.width = albumsWidth + "px"
                $('.fileSize')[i].style.width = albumsWidth + "px"
            });
        })
    }
    setHeight() {
        if ($(window).width() > 800) {
            $('#scroll').height($(window).height() - 100)
            $('#playlist').height($(window).height() - 100)
        } else {
            $('#scroll').height($(window).height() - 140)
            $('#playlist').height($(window).height() - 140)
        }
        $(window).resize(function () {
            if ($(window).width() > 800) {
                $('#scroll').height($(window).height() - 100)
                $('#playlist').height($(window).height() - 100)
            } else {
                $('#scroll').height($(window).height() - 140)
                $('#playlist').height($(window).height() - 140)
            }
        })
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }
    clicks() {
        for (let i = 0; i < this.albums.length; i++) {
            this.albums[i].on('click', () => {
                net.sendData("NEXT", i)
            })
        }
        $("body").keypress(e => {
            if (e.charCode == 32) {
                if (visual.visualize) $("#visual").css("display", "none")
                else $("#visual").css("display", "block")
                visual.visualize = !visual.visualize
            }
        })
        $('#prev').on('click', () => {
            if (this.musicLoaded) {
                music.prev()
                if (this.currentSongIndex == 0) this.currentSongIndex = this.currentPlayingPlaylistLenght
                if (this.musicLoadedAlbumNowDisplayed) this.setHighlight(this.currentPlaylistRows[--this.currentSongIndex])
                else --this.currentSongIndex
                this.resume()
            }
        })
        $('#pause').on('click', () => {
            if (this.musicLoaded) {
                if (music.pause()) this.resume()
                else this.pause()
            }
        })
        $('#next').on('click', () => {
            if (this.musicLoaded) {
                music.next()
                console.log(this.currentSongIndex)
                console.log(this.currentPlaylistRows.length)
                if (this.currentSongIndex == this.currentPlayingPlaylistLenght - 1) this.currentSongIndex = -1
                if (this.musicLoadedAlbumNowDisplayed) this.setHighlight(this.currentPlaylistRows[++this.currentSongIndex])
                else ++this.currentSongIndex
                this.resume()
            }
        })
        $('#customPlaylists').on('click', () => {
            net.loadCustomPlaylist()
        })
    }
    loadContent(data, i) {
        data.dirs.forEach(dir => {
            this.albumsNames.push(dir)
            const album = $('<img src="/static/covers/' + dir + '.jpg">')
            this.albums.push(album)
            $('#albums').append(album)
        })
        this.updateContent(data, i)
        this.clicks()
    }
    updateContent(data, i, customPlaylist = false) {
        if (customPlaylist) {
            let files = data
            data = {}
            data.files = files
        }
        console.log(data)
        $('#files').empty()
        this.currentPlaylistRows = []
        data.files.forEach((file, index) => {
            if (!customPlaylist) file.album = this.albumsNames[i]
            let row = $('<div class="row"></div>')
            let rowControl = $('<div class="rowControl"></div>')
            let rowContent = $('<div class="rowContent"></div>')
            let rowAddToPlaylist = $('<div class="rowAddToPlaylist"></div>')
            row.append(rowControl)
            row.append(rowContent)
            row.append(rowAddToPlaylist)
            rowContent.append($('<div class="albumTitle"><p>' + this.capitalizeFirstLetter(file.album) + '</p></div>'))
            rowContent.append($('<div class="fileName"><p>' + file.name + '</p></div>'))
            rowContent.append($('<div class="fileSize"><p>' + Math.round(file.size / Math.pow(1024, 2) * 100) / 100 + 'MB</p></div>'))
            row.hover(() => {
                this.previousColor = row.css("background-color")
                row.css("background-color", "#282828")
                if (rowControl.is(':empty')) {
                    rowControl.append($('<img class="rowControlImg" src="/static/icons/icons8-play-64.png"></img>'))
                }
                if (rowAddToPlaylist.is(':empty')) {
                    rowAddToPlaylist.append($('<img class="rowAddToPlaylistImg" src="/static/icons/baseline_add_white_18dp.png"></img>'))
                }
            }, () => {
                row.css("background-color", this.previousColor)
                rowControl.find('.rowControlImg').remove()
                rowAddToPlaylist.find('.rowAddToPlaylistImg').remove()
            })
            row.on('click', () => {
                if (this.musicLoadedAlbumIndex == i && this.currentSongIndex == index) {
                    if (music.play(data.files, index, true)) this.resume()
                    else this.pause()
                } else {
                    music.play(data.files, index, false)
                    this.resume()
                }
                this.musicLoadedAlbumNowDisplayed = true
                this.musicLoaded = true
                this.musicLoadedAlbumIndex = i
                this.currentSongIndex = index
                this.currentPlayingPlaylistLenght = this.currentPlaylistRows.length
                this.setHighlight(this.currentPlaylistRows[index])
            })
            rowAddToPlaylist.on('click', (e) => {
                e.stopPropagation()
                net.saveCustomPlaylist(file)
            })
            $('#files').append(row)
            this.currentPlaylistRows.push(row)
        })
        if (this.musicLoadedAlbumIndex == i) {
            this.musicLoadedAlbumNowDisplayed = true
            this.currentPlayingPlaylistLenght = this.currentPlaylistRows.length
        }
        else this.musicLoadedAlbumNowDisplayed = false
        if (this.musicLoadedAlbumNowDisplayed) this.setHighlight(this.currentPlaylistRows[this.currentSongIndex])
        this.setWidth()
    }
    setHighlight(target) {
        $('#files').children().each((index, element) => {
            element.style.backgroundColor = ""
            $(element).find('.rowControlImg').remove()
            $(element).find('.rowControlImgPause').remove()
        })
        //console.log($(target[0]).find('.rowControl'))
        $(target[0]).find('.rowControl').append($('<img class="rowControlImgPause"></img>'))
        this.controlImg(true, false)
        target[0].style.backgroundColor = "#282828"
        this.previousColor = "rgb(51, 51, 51)"
    }
}

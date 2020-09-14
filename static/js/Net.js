class Net {
    constructor() {
        this.sendData("FIRST", 0)
    }
    sendData(action, albumNumber) {
        let d1 = new Date()
        $.ajax({
            url: "/",
            data: { action: action, albumNumber: albumNumber },
            type: "POST",
            success: data => {
                let d2 = new Date()
                console.log(d2.getTime() - d1.getTime())
                console.log(data)
                console.log(albumNumber)
                if (action === "FIRST") ui.loadContent(data, albumNumber)
                else if (action === "NEXT") ui.updateContent(data, albumNumber)
            },
            error: (xhr, status, error) => {
                console.log(xhr);
            },
        })
    }
    saveCustomPlaylist(file) {
        $.ajax({
            url: "/",
            data: { action: "SAVE", file: JSON.stringify(file) },
            type: "POST",
            error: (xhr, status, error) => {
                console.log(xhr);
            },
        })
    }
    loadCustomPlaylist() {
        $.ajax({
            url: "/",
            data: { action: "LOAD" },
            type: "POST",
            success: data => {
                console.log(data)
                ui.updateContent(data, -1, true)
            },
            error: (xhr, status, error) => {
                console.log(xhr);
            },
        })
    }
}

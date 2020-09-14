class Visual {
    constructor() {
        this.visualize = false
        this.init()
    }
    init() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(40, ($(window).width() - 260) / ($(window).height() - 210), 0.4, 2000)
        this.orbitControl = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        let axes = new THREE.AxesHelper(1000)

        this.renderer.setClearColor(0x000000, 0)
        this.renderer.setSize($(window).width() - 260, $(window).height() - 210)
        $("#visual").append(this.renderer.domElement)

        //this.scene.add(axes)
        //this.camera.position.set(20000, 200, 0)
        this.camera.lookAt(this.scene.position)





        this.cubes = []
        let geometry = new THREE.SphereGeometry(6, 32, 32)
        //let geometry = new THREE.BoxGeometry(40, 40, 40)
        //let geometry = new THREE.CylinderGeometry(14, 14, 8, 64)
        //let material = new THREE.MeshNormalMaterial()
        let material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('/static/txt/a.jpg') })
        //let material = new THREE.MeshBasicMaterial({ color: 0x5ea564 })

        // for (let i = 0; i < 162; i++) {

        // }

        for (let i = 0; i < 8; i++) {
            let stackAngle = Math.PI / 2 - i * (Math.PI / 24) + 2.1 //2 * Math.PI / 3 // (Math.PI / 14) + 2.3
            let xz = 300 * Math.cos(stackAngle)
            let y = 320 * Math.sin(stackAngle)
            for (let j = 0; j < 12; j++) {
                let sectorAngle = j * (2 * Math.PI / 12) + (i % 2) * 50
                let x = xz * Math.cos(sectorAngle)
                let z = xz * Math.sin((sectorAngle))
                let cube = new THREE.Mesh(geometry, material)
                cube.position.set(x, y, z)
                cube.lookAt(0, 0, 0)
                cube.rotateX(Math.PI / 2)
                this.cubes.push(cube)
                this.scene.add(cube)
            }
        }







        this.angle = 0
        this.render()
    }
    render() {
        if (this.visualize) {
            if (music.analyserReady) {
                let data = music.getData()
                //console.log(data)
                for (let i = 0; i < 96; i++) {
                    // console.log(data[i])
                    let radius = (data[i] / 320 + 0.7) * (data[i] / 320 + 0.7) * (data[i] / 320 + 0.7)
                    this.cubes[i].scale.x = radius
                    this.cubes[i].scale.y = radius
                    this.cubes[i].scale.z = radius
                }
                //camera

                //this.cube.position.y = data[0] / 2 + 5

            }
            this.camera.position.z = 820 * Math.cos(this.angle)
            this.camera.position.x = 820 * Math.sin(this.angle)
            this.camera.lookAt(this.scene.position)
            this.angle += 0.001
            this.renderer.render(this.scene, this.camera)
        }

        requestAnimationFrame(this.render.bind(this))
        //console.log(music.getData())
    }
}
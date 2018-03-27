var renderer,
    scene,
    camera,
    container;

var arSource,
    arContext,
    arMarker = [];

var 
    mesh;

var loader = new THREE.FileLoader();

 var geometry = new THREE.Geometry();

    var  HEIGHT,
        WIDTH, fieldOfView, aspectRatio,
        nearPlane, farPlane, stats,
        geometry, particleCount,
        i, h, color, size,
        materials = [],
        mouseX = 0,
        mouseY = 0,
        windowHalfX, windowHalfY, cameraZ,
        fogHex, fogDensity, parameters = {},
        parameterCount, particles;


    var linegeometry= new THREE.Geometry();

    var particlePositions;
    var color;



init();

function init(){



    container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    scene = new THREE.Scene();
    // camera = new THREE.Camera();

    HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        windowHalfX = WIDTH / 2;
        windowHalfY = HEIGHT / 2;

        fieldOfView = 75;
        aspectRatio = WIDTH / HEIGHT;
        nearPlane = 1;
        farPlane = 10000;


        // renderer = new THREE.WebGLRenderer(); /* Rendererererers particles.  */
        // renderer.setPixelRatio(window.devicePixelRatio); /*  Probably 1; unless you're fancy.    */
        // renderer.setSize(WIDTH, HEIGHT); /*  Full screen baby Wooooo!    */

        /*  fieldOfView — Camera frustum vertical field of view.
    aspectRatio — Camera frustum aspect ratio.
    nearPlane — Camera frustum near plane.
    farPlane — Camera frustum far plane.

    - https://threejs.org/docs/#Reference/Cameras/PerspectiveCamera

    In geometry, a frustum (plural: frusta or frustums)
    is the portion of a solid (normally a cone or pyramid)
    that lies between two parallel planes cutting it. - wikipedia.      */

        cameraZ = 1000; /*  So, 1000? Yes! move on! */
        fogHex = 0x000000; /* As black as your heart.   */
        fogDensity = 0.0001; /* So not terribly dense?  */

        //camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 50000 );
        camera.position.set( -50.70311858236377, -3489.2936443600024, 1221.0662204047978 );

    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);
    scene.add(camera);
    scene.visible = false;




                        arSource = new THREEx.ArToolkitSource({
                            sourceType : 'webcam',
                        });

                        arContext = new THREEx.ArToolkitContext({
                            cameraParametersUrl: './assets/data/camera_para.dat',
                            detectionMode: 'mono',
                        });

                        arMarker[0] = new THREEx.ArMarkerControls(arContext, camera, {
                            type : 'pattern',
                            patternUrl : './assets/data/petras_iot.patt',
                            changeMatrixMode: 'cameraTransformMatrix'
                        });

                        arMarker[1] = new THREEx.ArMarkerControls(arContext, camera, {
                            type : 'pattern',
                            patternUrl : './assets/data/marker_codepen.patt',
                            changeMatrixMode: 'cameraTransformMatrix'
                        });

                        arSource.init(function(){
                          arSource.onResize();
                          arSource.copySizeTo(renderer.domElement);

                          if(arContext.arController !== null) arSource.copySizeTo(arContext.arController.canvas);

                             });

    arContext.init(function onCompleted(){
        
        camera.projectionMatrix.copy(arContext.getProjectionMatrix());
        console.log("here we are");
    
});

    particleCount = 195464;




    /* handle */

    
        loader.load(
                // resource URL
                "models/json/smaller.json",
                // onLoad callback
                function ( obj2 ) {
                    var obj = JSON.parse(obj2)
                    console.log(obj.data.length);
                    //geometry = new THREE.Geometry(); /*   NO ONE SAID ANYTHING ABOUT MATH! UGH!   */
                    geometry = new THREE.BufferGeometry();
                    
                    particlePositions = [];
                    var colors = [];
                    var sizes = [];
                      for (i = 0; i < particleCount; i++) {
                    // var vertex = new THREE.Vector3();
                    // vertex.x = obj.data[i].killer_position_x;
                    // vertex.y = -obj.data[i].killer_position_y;
                    // vertex.z = obj.data[i].killer_placement*10;
                    //console.log(vertex.z);
                    particlePositions.push(obj.data[i].killer_position_x);
                    
                    particlePositions.push(-obj.data[i].killer_position_y);
                    
                    particlePositions.push(obj.data[i].heihgtxy*0.01);
                    //linegeometry.vertices.push(new THREE.Vector3(obj.data[i].killer_position_x,-obj.data[i].killer_position_y,obj.data[i].killer_placement*10));
                    
                    //geometry.colors.push(new THREE.Color(obj.data[i].ppl_killed*0.1, obj.data[i].killer_placement*0.01, 0));
                    color= new THREE.Color(obj.data[i].ppl_killed*0.1, obj.data[i].killer_placement*0.01, 0);
                    colors.push(color.r,color.g,color.b);
                    //geometry.vertices.push(vertex);
                    }
                    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( particlePositions, 3 ).setDynamic(true));
                    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
               
                      parameters = [
                            [
                                [1, 1, 0.5], 0.5
                            ],
                            [
                                [0.95, 1, 0.5], 0.5
                            ],
                            [
                                [0.90, 1, 0.5], 0.5
                            ],
                            [
                                [0.85, 1, 0.5], 0.5
                            ],
                            [
                                [0.80, 1, 0.5], 0.5
                            ]
                        ];
                 parameterCount = parameters.length;
        /*  I told you to take those motion sickness pills.
    Clean that vommit up, we're going again!    */
                var psMat = new THREE.PointsMaterial();
                psMat.vertexColors = true;
                psMat.depthTest=false;
                psMat.opacity=0.5;
                var material = new THREE.LineBasicMaterial({
                        color: 0x0000ff, opacity:0.1,transparent:true
                });
                
                geometry.computeBoundingBox();
                    
                geometry.center();
                linegeometry.computeBoundingBox();
                    
                linegeometry.center();
                particles = new THREE.Points(geometry, psMat);
                var line = new THREE.Line( linegeometry , material );
                //group.add(particles);
                //particles.sizeAttenuation = true;
                scene.add(particles);
                scene.add(line);
                
                // for (i = 0; i < parameterCount; i++) {
                //     //olor = parameters[i][0];
                //     size = parameters[i][1];
                //     materials[i] = new THREE.PointsMaterial({
                //         size: size
                //     });
                //     particles = new THREE.Points(geometry, materials[i]);
                //     // particles.position.x=0;
                //     // particles.position.y=0;
                //     // particles.position.z=0;
                //     //particles.rotation.x = Math.random() * 6;
                //     //particles.rotation.y = Math.random() * 6;
                //     //particles.rotation.z = Math.random() * 6;
                //     scene.add(particles);
                // }
                    
                container.appendChild(renderer.domElement); /* Let's add all this crazy junk to the page.   */
                animate();
                    // var material = materials[ 0 ];
                    // var object = new THREE.Mesh( geometry, material );
                    // scene.add( object );
                },
                // onProgress callback
                function ( xhr ) {
                    console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
                },
                // onError callback
                function( err ) {
                    console.log( 'An error happened' );
                }
            );


// trythis
//     mesh = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({
//         color: 0xFF00FF,
//         transparent: true,
//         opacity: 0.5
//     }));
//     scene.add(mesh);






  // render();   



    
}   



function animate(){

    requestAnimationFrame(animate);
    render();
}



function render(){
    requestAnimationFrame(render);
    renderer.render(scene,camera);                

    if(arSource.ready === false) return;

    arContext.update(arSource.domElement);
    scene.visible = camera.visible;


//     mesh.rotateX(.1);

}          

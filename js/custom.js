// ページの読み込みを待つ
window.addEventListener('load', init);
function init() {

        // レンダラーを作成
        const renderer = new THREE.WebGLRenderer({
                canvas: document.querySelector('#myCanvas'),
                antialias: true,
                alpha: true
        });

        // シーンを作成
        const scene = new THREE.Scene();
        // カメラを作成
        const camera = new THREE.PerspectiveCamera(45, 1.0);
        camera.position.set(0, 0, 20);

        var geometry = new THREE.BufferGeometry();

        var triangles = 1000;
        var baseSize = 10;
        var baseSizeHalf = baseSize / 2;
        var triangleSize = 0.3;
        var triangleSizeHalf = triangleSize / 2;

        var positions = new Float32Array(triangles * 3 * 3);
        var indices = new Uint32Array(triangles * 3);

        for (var i = 0; i < positions.length; i += 9) {
                //ポリゴンの位置を決める
                var baseX = Math.random() * baseSize - baseSizeHalf;
                var baseY = Math.random() * baseSize - baseSizeHalf;
                var baseZ = Math.random() * baseSize - baseSizeHalf;

                //ポリゴンの座標を決める
                var x1 = baseX + Math.random() * triangleSize - triangleSizeHalf;
                var y1 = baseY + Math.random() * triangleSize - triangleSizeHalf;
                var z1 = baseZ + Math.random() * triangleSize - triangleSizeHalf;

                var x2 = baseX + Math.random() * triangleSize - triangleSizeHalf;
                var y2 = baseY + Math.random() * triangleSize - triangleSizeHalf;
                var z2 = baseZ + Math.random() * triangleSize - triangleSizeHalf;

                var x3 = baseX + Math.random() * triangleSize - triangleSizeHalf;
                var y3 = baseY + Math.random() * triangleSize - triangleSizeHalf;
                var z3 = baseZ + Math.random() * triangleSize - triangleSizeHalf;

                //座標データをpositionsに入れる
                positions[i] = x1;
                positions[i + 1] = y1;
                positions[i + 2] = z1;

                positions[i + 3] = x2;
                positions[i + 4] = y2;
                positions[i + 5] = z2;

                positions[i + 6] = x3;
                positions[i + 7] = y3;
                positions[i + 8] = z3;

        }

        for (var i = 0; i < indices.length; i++) {
                //indexを入れる
                indices[i] = i;
        }

        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.computeVertexNormals();
        var material = new THREE.MeshPhongMaterial({
                color: 0xff4000,
                specular: 0xff4000,
                shininess: 100,
                side: THREE.DoubleSide
        });
        
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(0, 0, 0);
        scene.add(mesh);
        tick();
        var time = 0;

        // 毎フレーム時に実行されるループイベントです
        function tick() {
                time += 1/50;
                renderer.render(scene, camera);
                time = performance.now();
                //mesh.rotation.x = (Math.cos(Math.PI * time * 0.1 / 360) * 0.05) + 0.1;
                mesh.rotation.y += Math.PI / 300;
                requestAnimationFrame(tick);
        }
        // 初期化のために実行
        onResize();

        // リサイズイベント発生時に実行
        window.addEventListener('resize', onResize);
        function onResize() {
                // サイズを取得
                const width = window.innerWidth;
                const height = window.innerHeight;
                // レンダラーのサイズを調整する
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(width, height);
                // カメラのアスペクト比を正す
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
        }
}

import * as THREE from 'three';
import { TextureLoader } from 'three';
            // Cria a cena Three.js

            var scene = new THREE.Scene();

            // Cria a câmera Three.js com visão perspectiva

            var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

            // Cria o renderizador Three.js com suporte a WebGL

            var renderer = new THREE.WebGLRenderer();

            // Define o tamanho do renderizador para o tamanho da janela do navegador

            renderer.setSize(window.innerWidth, window.innerHeight);

            // Adiciona o elemento DOM do renderizador à página HTML

            document.body.appendChild(renderer.domElement);

            // ativando as sombras
            renderer.shadowMap.enabled = true;
            
            //--------------------------------- LUZ -----------------------------------------

            // luz ambiente 
            const ambient_light = new THREE.AmbientLight(0x404040);  // Luz suave para iluminar tudo de forma leve
            scene.add(ambient_light);

            // luz pontual (lampada)
            const point_light = new THREE.PointLight(0xf5f5dc, 50, 100);
            point_light.position.set(0, 4, 0);
            point_light.castShadow = true;
            scene.add(point_light);
            const helper_point_light = new THREE.PointLightHelper(point_light, 0.1);
            scene.add(helper_point_light);
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            
            //------------------------------- CAMERA ----------------------------------------
            //terceira pessoa
            /*
            camera.position.z = 6.5;
            camera.position.x = 1;
            camera.position.y = 3;
            */

            
            //primeira pessoa
            
            camera.position.z = -4.5;
            camera.position.x = 0;
            camera.position.y = 2;
            camera.rotation.y = Math.PI;
            
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            
            //------------------ Cria a geometria Three.js para o objeto mesh ---------------
            //********* Criando a lampada *************
            // * Criando o corpo da lampada
            
            const lamp_body_geometry = new THREE.CylinderGeometry(0.1, 0.1, 6, 32);
            const lamp_body_material = new THREE.MeshPhongMaterial({color : 0xFFB69C });
            const lamp_body = new THREE.Mesh(lamp_body_geometry, lamp_body_material);
            lamp_body.position.set(0, 7, 0);
            lamp_body.castShadow = true;
            lamp_body.receiveShadow = true;
            scene.add(lamp_body);

            // * Globo luminoso da lampada
            const lamp_light_geometry = new THREE.SphereGeometry(0.2, 32, 32);
            const lamp_light_material = new THREE.MeshBasicMaterial({color: 0xFFFFb2}); 
            const lamp_light = new THREE.Mesh(lamp_light_geometry, lamp_light_material);
            lamp_light.position.set(0, 4, 0);
            lamp_light.castShadow = true;
            scene.add(lamp_light);
            //********************************************* 

            // Criando chão
            const floor_geometry = new THREE.PlaneGeometry(50, 50);
            const texture_loader = new TextureLoader;
            const floor_texture = texture_loader.load("./textures/wood_floor.jpg");
            const floor_material = new THREE.MeshPhongMaterial({map : floor_texture});
            const floor = new THREE.Mesh(floor_geometry, floor_material);
            floor.rotation.x = - Math.PI / 2;
            floor.position.set(0, -5, 0);
            scene.add(floor);  


            // Criando a mesa de sinuca como um plano verde
            const tableGeometry = new THREE.PlaneGeometry(10, 5);  // Mesa com dimensões 10x5 unidades
            const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 });  // Cor verde escuro
            const table = new THREE.Mesh(tableGeometry, tableMaterial);

            // Girando a mesa para que ela fique na posição horizontal
            table.rotation.x = -Math.PI / 2;  // Rotaciona para ficar deitada
            table.receiveShadow = true;
            scene.add(table);

            // Criando as bordas da mesa com cubos
            const borderMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });  // Cor marrom das bordas
            const borders = [];

            // Criando as 4 bordas ao redor da mesa
            borders.push(new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 0.3), borderMaterial));  // Borda superior
            borders.push(new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 0.3), borderMaterial));  // Borda inferior
            borders.push(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 5), borderMaterial));   // Borda esquerda
            borders.push(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 5), borderMaterial));   // Borda direita

            // Posicionando as bordas
            borders[0].position.set(0, 0.1, 2.5);  // Superior
            borders[1].position.set(0, 0.1, -2.5); // Inferior
            borders[2].position.set(-5, 0.1, 0);   // Esquerda
            borders[3].position.set(5, 0.1, 0);    // Direita

            //adicionando sombras
            borders.forEach(border => border.receiveShadow = true);

            // Adicionando as bordas à cena
            borders.forEach(border => scene.add(border));
            
            const ballRadius = 0.1;
            const whiteBall = new THREE.Mesh(
            new THREE.SphereGeometry(ballRadius, 32, 32),
            new THREE.MeshPhysicalMaterial({ color: 0xffffff })  // Cor branca
            );
            whiteBall.position.set(0, ballRadius, -1.5);  // Posicionar a bola branca
            whiteBall.castShadow = true;
            scene.add(whiteBall);

            // Função para criar uma bola colorida
            function createBall(color, position) {
            const ball = new THREE.Mesh(
                new THREE.SphereGeometry(ballRadius, 32, 32),
                new THREE.MeshPhysicalMaterial({ color: color })
            );
            ball.position.set(position.x, ballRadius, position.z);
            ball.castShadow = true;
            scene.add(ball);
            return ball;
            }
            const cue = new THREE.Mesh(
                new THREE.CylinderGeometry(0.05, 0.05, 2, 32),
                new THREE.MeshStandardMaterial({ color: 0x8B4513 })  // Cor do taco
            );
            cue.position.set(0, 0.3, -2.5);
            cue.rotation.x = - Math.PI / 2.3;
            cue.castShadow = true;
            scene.add(cue);
            // Colocando as bolas em uma formação triangular (14 bolas coloridas)
            const balls = [];
            const colors = [0xff0000, 0x0000ff, 0xffff00, 0x00ff00, 0xff00ff, 0x00ffff];  // Exemplo de cores
            let xOffset = 0;
            let zOffset = 0;

            for (let row = 0; row < 5; row++) {
            for (let i = 0; i <= row; i++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                const x = xOffset + (i * 0.22) - (row * 0.11);  // Distribui as bolas na formação triangular
                const z = zOffset + (row * 0.22);
                balls.push(createBall(color, new THREE.Vector3(x, 0, z)));
            }
            }
            // Definindo o tamanho da mesa (os limites da mesa de sinuca)
            const tableWidth = 9.5;  // Limite máximo para x
            const tableHeight = 4.5;  // Limite máximo para z

            // Definindo um vetor de direção para cada bola
            balls.forEach(ball => {
            // Cada bola recebe uma direção aleatória, mas fixa, para se mover
            ball.direction = new THREE.Vector3(
                (Math.random() - 0.5) * 2,  // Direção em x
                0,                          // Sem movimento no eixo y (as bolas estão no plano)
                (Math.random() - 0.5) * 2   // Direção em z
            ).normalize();  // Normaliza o vetor para que todas as bolas tenham a mesma velocidade
            });

            // Função de animação
            function animate(time) {
            requestAnimationFrame(animate);

            // Movendo a bola branca em direção ao triângulo
            if (whiteBall.position.z < 0) {
                whiteBall.position.z += 0.02;  // Movimenta a bola branca para frente
            } else {
                // Agora, todas as bolas coloridas se movem em linha reta e verificam colisões
                balls.forEach(ball => {
                // Movendo a bola
                ball.position.add(ball.direction.clone().multiplyScalar(0.02));  // Velocidade das bolas

                // Verifica colisão com as paredes no eixo X
                if (ball.position.x >= tableWidth / 2 || ball.position.x <= -tableWidth / 2) {
                    ball.direction.x *= -1;  // Inverte a direção no eixo X
                }

                // Verifica colisão com as paredes no eixo Z
                if (ball.position.z >= tableHeight / 2 || ball.position.z <= -tableHeight / 2) {
                    ball.direction.z *= -1;  // Inverte a direção no eixo Z
                }
                });
            }

            // Renderiza a cena
            renderer.render(scene, camera);
            }
            animate();

              

              
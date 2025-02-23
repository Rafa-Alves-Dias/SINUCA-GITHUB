import * as THREE from 'three';
import { TextureLoader } from 'three';
import * as CANNON from 'cannon';

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
            //---------------------------- CANNON (FISICA) ----------------------------------
            // Cria o mundo físico
            const world = new CANNON.World();
            // Define a gravidade (por exemplo, gravidade terrestre)
            world.gravity.set(0, -9.82, 0);
            // Escolhe um algoritmo de detecção de colisões (broadphase)
            world.broadphase = new CANNON.NaiveBroadphase();
            // Define iterações do solver para colisões (quanto maior, mais preciso, porém mais pesado)
            world.solver.iterations = 10;

            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            
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
            
            // * Top-down
            /*
            camera.position.set(0, 10, 0);
            camera.rotation.x =  - Math.PI / 2;
            camera.rotation.z =  - Math.PI / 2;
            */ 

            // * Terceira pessoa
            /*
            camera.position.z = 6.5;
            camera.position.x = 1;
            camera.position.y = 3;
            */

            // * Visão lateral
            /*
            camera.position.set(10, 5, 0);
            camera.lookAt(0, 0, 0);
            */
            
            // * Primeira pessoa
            
            camera.position.z = -4.5;
            camera.position.x = 0;
            camera.position.y = 2;
            camera.rotation.y = Math.PI;
            
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            
            //================ Cria a geometria Three.js para o objeto mesh =================
            //------------------------------ LAMPADA ----------------------------------------
           
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
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


            //------------------------------- CHAO ------------------------------------------
            const floor_geometry = new THREE.PlaneGeometry(50, 50);
            const texture_loader = new TextureLoader;
            const floor_texture = texture_loader.load("./textures/wood_floor.jpg");
            const floor_material = new THREE.MeshPhongMaterial({map : floor_texture});
            const floor = new THREE.Mesh(floor_geometry, floor_material);
            floor.rotation.x = - Math.PI / 2;
            floor.position.set(0, -5, 0);
            floor.receiveShadow = true;
            scene.add(floor);  
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


            //------------------------------ MESA -------------------------------------------
            const table_dimensons = [10, 5, 0.2];
            //_______________________________ MESH __________________________________________
            
            // * Criando a mesa de sinuca como um plano verde
            const tableGeometry = new THREE.PlaneGeometry(table_dimensons[0], table_dimensons[1]);  // Mesa com dimensões 10x5 unidades
            const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 });  // Cor verde escuro
            const table = new THREE.Mesh(tableGeometry, tableMaterial);

            // * Girando a mesa para que ela fique na posição horizontal
            table.rotation.x = -Math.PI / 2;  // Rotaciona para ficar deitada
            table.receiveShadow = true;
            table.castShadow = true;
            scene.add(table);
            //...............................................................................

            //_____________________________ FISICA __________________________________________
            // * Criando o Material
            const table_material = new CANNON.Material('table_material');

            // * Criando o corpo da mesa
            const table_body = new CANNON.Body({
                mass: 0, // Massa 0 significa que é estático
                material: table_material,
                position: new CANNON.Vec3(0, -0.1, 0), // Posição da mesa
            });
            
           // Dimensões corretas (half extents)
            /*const table_halfExtents = new CANNON.Vec3(
                table_dimensons[0] / 2, // Largura (X)   Largura: 10 → 5
                table_dimensons[2] / 2,   // Profundidade (Z) Profundidade: 0.2 → 0.1
                table_dimensons[1] / 2, // Altura (Y) - espessura da mesa Altura: 5 → 2.5
            );
            table_body.addShape(new CANNON.Box(table_halfExtents));*/

            table_body.addShape(new CANNON.Box(new CANNON.Vec3(5, 0.1, 2.5)));

            // Remova a rotação, pois a caixa já está alinhada com o plano XZ
            world.addBody(table_body);
            //...............................................................................
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            
            //------------------------------ BORDAS -----------------------------------------
            const borders_dimensions_upDown = [10, 0.4, 0.4];
            const borders_dimensions_leftRight = [0.4, 0.4, 5];

            const borders_position_up = [0, 0.1, 2.5];
            const borders_position_down = [0, 0.1, -2.5];
            const borders_position_left = [-5, 0.1, 0];
            const borders_position_right = [5, 0.1, 0];
            //_______________________________ MESH __________________________________________
            // * Criando as bordas da mesa com cubos
            const borderMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });  // Cor marrom das bordas
            const borders = [];

            // * Criando as 4 bordas ao redor da mesa
            borders.push(new THREE.Mesh(new THREE.BoxGeometry(...borders_dimensions_upDown), borderMaterial));  // Borda superior
            borders.push(new THREE.Mesh(new THREE.BoxGeometry(...borders_dimensions_upDown), borderMaterial));  // Borda inferior
            borders.push(new THREE.Mesh(new THREE.BoxGeometry(...borders_dimensions_leftRight), borderMaterial));   // Borda esquerda
            borders.push(new THREE.Mesh(new THREE.BoxGeometry(...borders_dimensions_leftRight), borderMaterial));   // Borda direita

            // * Posicionando as bordas
            borders[0].position.set(...borders_position_up);  // Superior
            borders[1].position.set(...borders_position_down); // Inferior
            borders[2].position.set(...borders_position_left);   // Esquerda
            borders[3].position.set(...borders_position_right);    // Direita

            // * Adicionando sombras
            borders.forEach(border => border.receiveShadow = true);
            borders.forEach(border => border.castShadow = true);

            // * Adicionando as bordas à cena
            borders.forEach(border => scene.add(border));
            //...............................................................................

            //_____________________________ FISICA __________________________________________
            const borders_bodies = [];
            // * Criando o Material
            const border_material = new CANNON.Material('borderMaterial');
            // * Funcao para criacao do Body das bordas
            const border_shapes = [
            new CANNON.Box(new CANNON.Vec3(...borders_dimensions_upDown.map(x => x / 2))),
            new CANNON.Box(new CANNON.Vec3(...borders_dimensions_leftRight.map(x => x / 2)))
            ];
            // (x => x / 2) é feito assim pois o Box calcula a distancia do centro para a borda.
            borders_bodies.push(new CANNON.Body({ mass: 0, material: border_material }).addShape(border_shapes[0]));
            borders_bodies.push(new CANNON.Body({ mass: 0, material: border_material }).addShape(border_shapes[0]));
            borders_bodies.push(new CANNON.Body({ mass: 0, material: border_material }).addShape(border_shapes[1]));
            borders_bodies.push(new CANNON.Body({ mass: 0, material: border_material }).addShape(border_shapes[1]));

            borders_bodies[0].position.set(...borders_position_up);
            borders_bodies[1].position.set(...borders_position_down);
            borders_bodies[2].position.set(...borders_position_left);
            borders_bodies[3].position.set(...borders_position_right);

            borders_bodies.forEach(body => world.addBody(body));
            //...............................................................................

            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            
            
            const ballRadius = 0.1;


            //---------------------------- BOLA BRANCA --------------------------------------
            const white_ball_x = 0;
            const white_ball_y = ballRadius;
            const white_ball_z = -1.1;
            //_______________________________ MESH __________________________________________
            const white_ball_mesh = new THREE.Mesh(
            new THREE.SphereGeometry(ballRadius, 32, 32),
            new THREE.MeshPhysicalMaterial({ color: 0xffffff })  // Cor branca
            );

            white_ball_mesh.position.set(white_ball_x, white_ball_y, white_ball_z);  // Posicionar a bola branca
            white_ball_mesh.castShadow = true;
            scene.add(white_ball_mesh);
            //...............................................................................

            //_____________________________ FISICA __________________________________________
            const ball_bodies = [];
            // * Cria o Material da bola
            const ball_material = new CANNON.Material('ballMaterial');
            // * Funcao para criacao do Body das bolas
            function ballBody(position){

                // * Criando o Body da bola
                const ball_shape = new CANNON.Sphere(ballRadius);
                const ball_body = new CANNON.Body({
                    mass: 0.1,             // Corpo dinâmico
                    material: ball_material, // Material físico previamente definido
                    position: new CANNON.Vec3(position.x, position.y, position.z),
                    linearDamping: 0.9,
                    angularDamping: 0.9
                });
                ball_body.addShape(ball_shape);
                ball_bodies.push(ball_body);
                world.addBody(ball_body);
            }
            ballBody(new THREE.Vector3(white_ball_x, white_ball_y, white_ball_z));

            //...............................................................................

            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

            //--------------------------- BOLA COLORIDA -------------------------------------
            
            // * Função para criar uma bola colorida
            function createBall(color, position) {
            const ball = new THREE.Mesh(
                new THREE.SphereGeometry(ballRadius, 32, 32),
                new THREE.MeshPhysicalMaterial({ color: color })
            );
            ball.position.set(position.x, ballRadius, position.z);
            ball.castShadow = true;
            scene.add(ball);
            // * Criacao do Body das bolas
            ballBody(position); 
            return ball;
            }
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

            //------------------------------- TACO ------------------------------------------
            const cue_position_x = 0;
            const cue_position_y = 0.3;
            const cue_position_z = -3.5;
            const cue_rotation = - Math.PI / 2.3;

            const cue_cylinder = [0.05, 0.05, 2, 32];


            //_______________________________ MESH __________________________________________
            
            const cue = new THREE.Mesh(
                new THREE.CylinderGeometry(...cue_cylinder), // Desestruturando o vetor 
                new THREE.MeshStandardMaterial({ color: 0x8B4513 })  // Cor do taco
            );
            cue.position.set(cue_position_x, cue_position_y, cue_position_z);
            cue.rotation.x = cue_rotation;
            cue.castShadow = true;
            scene.add(cue);
            //...............................................................................

            //_____________________________ FISICA __________________________________________
            // * Criando o Material
            const cue_material = new CANNON.Material('cue_material');

            // * Criando o Body
            const cue_shape = new CANNON.Cylinder(0.5, 0.5, 2, 32); 

            const cue_body = new CANNON.Body({
                mass: 0.1,             // Massa (0 significa corpo estático)
                material: cue_material, // Material que definimos antes
                position: new CANNON.Vec3(cue_position_x, cue_position_y, cue_position_z),
                linearDamping: 0.8,
                angularDamping: 0.8,
                //fixedRotation: true  // Impede rotações indesejadas
            });
            cue_body.type = CANNON.Body.KINEMATIC;
            cue_body.updateMassProperties(); // para garantir

            // Crie um quaternion local para girar o shape
            const shapeOrientation = new CANNON.Quaternion();
            // Rotaciona 90 graus em torno do eixo Z, por exemplo, 
            // para que o cilindro de Cannon fique alinhado ao eixo Y
            shapeOrientation.setFromAxisAngle(new CANNON.Vec3(0,0,1), Math.PI / 2);

            // Ao adicionar a forma ao Body, passe também a rotação local:
            cue_body.addShape(cue_shape, new CANNON.Vec3(0, 0, 0), shapeOrientation);


            // Ajuste correto da rotação (CANNON.js usa quaternions)
            cue_body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), cue_rotation);

            //cue_body.rotation = cue_rotation;
            world.addBody(cue_body);                // Adiciona ao mundo físico
              

            //...............................................................................


            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            
            
            
            //------ Colocando as bolas em uma formação triangular (14 bolas coloridas) -----
            const ball_meshes = [];
            const colors = [0xff0000, 0x0000ff, 0xffff00, 0x00ff00, 0xff00ff, 0x00ffff];  // Exemplo de cores
            let xOffset = 0;
            let zOffset = 1.1;

            for (let row = 0; row < 5; row++) {
            for (let i = 0; i <= row; i++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                const x = xOffset + (i * 0.22) - (row * 0.11);  // Distribui as bolas na formação triangular
                const z = zOffset + (row * 0.22);
                ball_meshes.push(createBall(color, new THREE.Vector3(x, 0, z)));
            }
            }
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            
            // Definindo o tamanho da mesa (os limites da mesa de sinuca)
            //const tableWidth = 9.5;  // Limite máximo para x
            //const tableHeight = 4.5;  // Limite máximo para z
            const tableWidth = 4.75;
            const tableHeight = 2.25;
            const cueHalfLength = 1; // Metade do comprimento do taco

            // Verificação mais rigorosa para o taco
            /*const cuePos = cue_body.position;
            if (cuePos.x < -tableWidth + cueHalfLength || 
                cuePos.x > tableWidth - cueHalfLength || 
                cuePos.z < -tableHeight + cueHalfLength || 
                cuePos.z > tableHeight - cueHalfLength) {
                
                // Reposicionamento com força
                cue_body.position.set(
                    THREE.MathUtils.clamp(cuePos.x, -tableWidth + cueHalfLength, tableWidth - cueHalfLength),
                    cuePos.y,
                    THREE.MathUtils.clamp(cuePos.z, -tableHeight + cueHalfLength, tableHeight - cueHalfLength)
                );
                
                // Parada imediata
                cue_body.velocity.set(0, 0, 0);
                cue_body.angularVelocity.set(0, 0, 0);
            }*/

            //--------------- Definindo um vetor de direção para cada bola ------------------
            ball_meshes.forEach(ball => {
            // Cada bola recebe uma direção aleatória, mas fixa, para se mover
            ball.direction = new THREE.Vector3(
                (Math.random() - 0.5) * 2,  // Direção em x
                0,                          // Sem movimento no eixo y (as bolas estão no plano)
                (Math.random() - 0.5) * 2   // Direção em z
            ).normalize();  // Normaliza o vetor para que todas as bolas tenham a mesma velocidade
            });

            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

            //------------------------------- FUNCOES FISICA --------------------------------
            
            //______________________________ CONTACT MATERIAL ______________________________
            
            function createContactMaterial() {
                // Define a relação de contato entre os materiais
                //=========================== BALL - BALL ==================================
                const ball_ball_colision = new CANNON.ContactMaterial(ball_material, ball_material, {
                    friction: 0.8,  // Coeficiente de atrito
                    restitution: 3 // Coeficiente de restituição
                }
                );
                world.addContactMaterial(ball_ball_colision);
                //'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
                
                //=========================== BALL - TABLE =================================
                const ball_table_colision = new CANNON.ContactMaterial(ball_material, table_material, {
                    friction: 0.5,  // Coeficiente de atrito
                    restitution: 0.5  // Coeficiente de restituição
                });
                world.addContactMaterial(ball_table_colision);
                

                //============================ BALL - CUE ===================================
                const ball_cue_colision = new CANNON.ContactMaterial(ball_material, cue_material, {
                    friction: 0.5,  // Coeficiente de atrito
                    restitution: 0.5  // Coeficiente de restituição
                }); 
                world.addContactMaterial(ball_cue_colision);
                //'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

                //=========================== BALL - BORDER =================================
                const ball_border_colision = new CANNON.ContactMaterial(ball_material, border_material, {
                    friction: 0.8,  // Coeficiente de atrito
                    restitution: 0.6  // Coeficiente de restituição
                });
                world.addContactMaterial(ball_border_colision);
                //'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

                //=========================== CUE - TABLE =================================
                const cue_table_colision = new CANNON.ContactMaterial(cue_material, table_material, {
                    friction: 0.8,  // Coeficiente de atrito
                    restitution: 0.2  // Coeficiente de restituição
                });
                world.addContactMaterial(cue_table_colision);
                //'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

                //=========================== CUE - BORDER =================================
                const cue_border_colision = new CANNON.ContactMaterial(cue_material, border_material, {
                    friction: 0.8,  // Coeficiente de atrito
                    restitution: 0.2  // Coeficiente de restituição
                }
                );
                world.addContactMaterial(cue_border_colision);
                //'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            }

            //...............................................................................
            createContactMaterial();
            //_______________________________ UPDATE PHYSICS _______________________________
            function updatePhysics() {

                if (cue_body.position.y < 0.2) {
                    cue_body.position.y = 0.3; // Mantém o taco acima da mesa
                    cue_body.velocity.y = 0;
                }


                world.step(1 / 60);  // Atualiza o mundo físico

                // Atualiza a posição e rotação da bola branca
                white_ball_mesh.position.copy(ball_bodies[0].position);
                white_ball_mesh.quaternion.copy(ball_bodies[0].quaternion);

                // Atualiza a posição e rotação das bolas coloridas
                ball_meshes.forEach((ball, index) => {
                ball.position.copy(ball_bodies[index + 1].position);
                ball.quaternion.copy(ball_bodies[index + 1].quaternion);
                });

                // Atualiza a posição e rotação do taco
                cue.position.copy(cue_body.position);
                cue.quaternion.copy(cue_body.quaternion);
            }
            //...............................................................................

            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

            //------------------------------ EVENTOS ----------------------------------------
            function strikeCueBall() {
                // Defina a direção do impulso, por exemplo, para frente (eixo Z positivo)
                const impulseMagnitude = 5  ; // Ajuste conforme necessário
                const impulse = new CANNON.Vec3(0, 0, impulseMagnitude);
                
                // Aplique o impulso na posição do corpo (geralmente no centro)
                ball_bodies[0].applyImpulse(impulse, ball_bodies[0].position);
            }
              // Verificação de limites
            function checkBounds() {
                const tableWidth = 4.75;  // Metade da largura da mesa
                const tableHeight = 2.25; // Metade da altura da mesa
                 /*
                ball_bodies.forEach(body => {
                    const pos = body.position;
                    if (pos.x < -tableWidth || pos.x > tableWidth || pos.z < -tableHeight || pos.z > tableHeight) {
                        // * Reposiciona a bola dentro dos limites da mesa
                        pos.x = THREE.MathUtils.clamp(pos.x, -tableWidth, tableWidth);
                        pos.z = THREE.MathUtils.clamp(pos.z, -tableHeight, tableHeight);
                        body.velocity.set(0, 0, 0); // Para a bola
                    }
                });
                */

                ball_bodies.forEach(body => {
                    const pos = body.position;
                    // Apenas reposiciona sem zerar velocidade
                    if (pos.x < -tableWidth || pos.x > tableWidth) {
                        pos.x = THREE.MathUtils.clamp(pos.x, -tableWidth, tableWidth);
                        body.velocity.x *= -0.5; // Inverte e reduz velocidade
                    }
                    
                    if (pos.z < -tableHeight || pos.z > tableHeight) {
                        pos.z = THREE.MathUtils.clamp(pos.z, -tableHeight, tableHeight);
                        body.velocity.z *= -0.5; // Inverte e reduz velocidade
                    }
                });
                // * Verifica o taco
                const cuePos = cue_body.position;
                if (cuePos.x < -tableWidth || cuePos.x > tableWidth || cuePos.z < -tableHeight || cuePos.z > tableHeight) {
                    cuePos.x = THREE.MathUtils.clamp(cuePos.x, -tableWidth, tableWidth);
                    cuePos.z = THREE.MathUtils.clamp(cuePos.z, -tableHeight, tableHeight);
                    cue_body.velocity.set(0, 0, 0); // Para o taco
                }
            }
            document.addEventListener('keydown', (e) => {
                if (e.code === 'Space') { // Tecla Espaço
                    strikeCueBall();
                }
            });
            
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            
            //-------------------------------- ANIMATE --------------------------------------

            function animate(time) {
            requestAnimationFrame(animate);

            // Atualiza a física
            updatePhysics();

            checkBounds();





            

            // Renderiza a cena
            renderer.render(scene, camera);
            }
            animate();

              

              
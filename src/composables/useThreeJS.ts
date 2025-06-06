// src/composables/useThreeJS.ts
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Ref } from 'vue';

interface Skill {
  name: string;
  level: number;
  color: string;
  satellites: string[];
}

export const useThreeJS = (containerRef: Ref<HTMLElement | undefined>) => {
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let raycaster: THREE.Raycaster;
  let mouse: THREE.Vector2;
  let animationId: number;
  
  const createSkillsVisualization = (skills: Skill[]) => {
    if (!containerRef.value) return;

    // Inicializar cena, câmera e renderizador
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      containerRef.value.clientWidth / containerRef.value.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight);
    containerRef.value.appendChild(renderer.domElement);

    // Adicionar controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Configurar luzes
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Criar esferas para cada skill
    skills.forEach(skill => {
      createSkillSphere(skill);
    });

    // Configurar raycasting para hover
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Event listener para hover
    renderer.domElement.addEventListener('mousemove', onMouseMove);

    // Iniciar animação
    animate();
  };

  const createSkillSphere = (skill: Skill) => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
      color: new THREE.Color(skill.color),
      shininess: 100,
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    
    // Posicionamento aleatório na órbita
    sphere.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );

    // Armazenar dados da skill para hover
    sphere.userData = { 
      isSphere: true,
      title: skill.name 
    };

    scene.add(sphere);
    return sphere;
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!containerRef.value) return;

    // Calcular posição do mouse normalizada
    const rect = containerRef.value.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Atualizar tooltip via DOM
    const tooltip = document.getElementById('skill-tooltip');
    if (!tooltip) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    
    tooltip.style.display = 'none';

    if (intersects.length > 0 && intersects[0].object.userData.title) {
      const sphere = intersects[0].object;
      tooltip.textContent = sphere.userData.title;
      tooltip.style.display = 'block';
      tooltip.style.left = `${event.clientX + 15}px`;
      tooltip.style.top = `${event.clientY}px`;
    }
  };

  const animate = () => {
    animationId = requestAnimationFrame(animate);

    // Animar todas as esferas
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.userData.isSphere) {
        object.rotation.x += 0.01;
        object.rotation.y += 0.01;
      }
    });

    renderer.render(scene, camera);
  };

  // Limpeza ao desmontar o componente
  const cleanup = () => {
    if (animationId) cancelAnimationFrame(animationId);
    if (renderer) {
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
    }
  };

  return {
    createSkillsVisualization,
    cleanup
  };
};
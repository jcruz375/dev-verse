// useThreeJS.ts
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib'
import { ref, onUnmounted, Ref } from 'vue';
import { Skill } from '../types/index'; // Adjust the import path as necessary

export function useThreeJS(containerRef: Ref<HTMLElement | null>) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  let controls: OrbitControls;
  let animationFrameId: number;

  const init = () => {
    if (!containerRef.value) return;

    // Set up renderer
    renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.value.appendChild(renderer.domElement);

    // Set up camera
    camera.position.z = 30;

    // Set up controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Handle window resize
    window.addEventListener('resize', handleResize);
  };

  const handleResize = () => {
    if (!containerRef.value) return;
    
    camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight);
  };

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };

  const createSkillsVisualization = (skills: Skill[]) => {
    init();
    
    // Clear previous objects
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    // Add your skill visualization logic here
    // For example:
    skills.forEach(skill => {
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(skill.color) });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
    });

    animate();
  };

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationFrameId);
    if (containerRef.value && renderer.domElement) {
      containerRef.value.removeChild(renderer.domElement);
    }
  });

  return {
    createSkillsVisualization
  };
}
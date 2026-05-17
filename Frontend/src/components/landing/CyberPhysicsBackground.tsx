'use client';

import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

type CyberPhysicsProps = {
  containerRef: React.RefObject<HTMLElement | null>;
};

// SVG Path definitions for our complex shapes
const SHAPES = {
  folder: "M 10 20 L 30 20 L 40 30 L 90 30 C 95.5 30 100 34.5 100 40 L 100 80 C 100 85.5 95.5 90 90 90 L 10 90 C 4.5 90 0 85.5 0 80 L 0 30 C 0 24.5 4.5 20 10 20 Z M 5 40 L 95 40",
  document: "M 20 10 L 60 10 L 80 30 L 80 90 C 80 95.5 75.5 100 70 100 L 20 100 C 14.5 100 10 95.5 10 90 L 10 20 C 10 14.5 14.5 10 20 10 Z M 60 10 L 60 30 L 80 30 M 30 50 L 60 50 M 30 70 L 60 70 M 30 85 L 50 85",
  heart: "M 50 85 C 50 85 10 55 10 30 C 10 15 25 10 35 20 C 50 35 50 35 50 35 C 50 35 50 35 65 20 C 75 10 90 15 90 30 C 90 55 50 85 50 85 Z",
  bubble: "M 10 30 C 10 13.4 27.9 0 50 0 C 72.1 0 90 13.4 90 30 C 90 46.6 72.1 60 50 60 C 44 60 38.3 58.9 33.2 57.1 L 10 65 L 15.8 48.7 C 12.1 43.4 10 37 10 30 Z M 30 30 L 70 30 M 30 40 L 60 40 M 30 20 L 70 20",
  frame: "M 10 10 L 90 10 L 90 90 L 10 90 Z M 15 15 L 85 15 L 85 85 L 15 85 Z M 15 85 L 45 45 L 60 60 L 70 50 L 85 70 M 25 30 A 10 10 0 1 0 25.1 30"
};

const COLORS = ['#00F0FF', '#FF00FF', '#FFFF00', '#00FF00']; // Cyan, Magenta, Yellow, Green

export default function CyberPhysicsBackground({ containerRef }: CyberPhysicsProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint;

    const engine = Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
      }
    });
    renderRef.current = render;

    // Custom rendering for SVG paths
    Matter.Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      const bodies = Composite.allBodies(engine.world);

      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        if (body.plugin.svgPath) {
          ctx.translate(body.position.x, body.position.y);
          ctx.rotate(body.angle);
          
          // Draw the custom shape
          const p = new Path2D(body.plugin.svgPath);
          
          ctx.shadowBlur = 15;
          ctx.shadowColor = body.plugin.color;
          ctx.strokeStyle = body.plugin.color;
          ctx.lineWidth = 2;
          ctx.fillStyle = '#050505AA'; // Translucent dark fill
          
          // Center the path drawing based on its ~100x100 bounding box
          ctx.translate(-50, -50);
          
          ctx.fill(p);
          ctx.stroke(p);
          
          // Reset
          ctx.translate(50, 50);
          ctx.rotate(-body.angle);
          ctx.translate(-body.position.x, -body.position.y);
          
          ctx.shadowBlur = 0;
        }
      }
    });

    // Create shapes
    const shapeKeys = Object.keys(SHAPES) as Array<keyof typeof SHAPES>;
    const shapes: Matter.Body[] = [];
    
    // Create ~20 shapes
    for (let i = 0; i < 20; i++) {
      const type = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      const body = Bodies.rectangle(
        Math.random() * width * 0.8 + width * 0.1, 
        -Math.random() * height - 100, // Start above screen
        80, 80, 
        {
          restitution: 0.6,
          frictionAir: 0.01,
          render: { visible: false }, // Hide default rendering
          plugin: {
            svgPath: SHAPES[type],
            color: color
          }
        }
      );
      shapes.push(body);
    }

    // Boundaries
    const ground = Bodies.rectangle(width / 2, height + 50, width * 2, 100, { isStatic: true, render: { visible: false } });
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 2, { isStatic: true, render: { visible: false } });
    
    // The "Laser Line" boundary
    const laserWall = Bodies.rectangle(-50, height / 2, 100, height * 2, { isStatic: true, render: { visible: false } });

    Composite.add(world, [...shapes, ground, rightWall, laserWall]);

    // Add mouse interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Composite.add(world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);
    runnerRef.current = runner;

    // Animation loop to sync laserWall position with the DOM sliding container
    let animFrame: number;
    const updateLaserWall = () => {
      if (containerRef.current) {
        // Find the actual sliding container (.after-slider-container)
        const sliderContainer = document.querySelector('.after-slider-container');
        if (sliderContainer) {
          const rect = sliderContainer.getBoundingClientRect();
          // The left edge of the slider container is the laser!
          // We position the Matter wall exactly on that edge.
          Matter.Body.setPosition(laserWall, { x: rect.left - 50, y: height / 2 });
          
          // Also apply a velocity to the wall so it pushes shapes effectively when moving right
          const targetVelocity = rect.left - (laserWall.position.x + 50);
          Matter.Body.setVelocity(laserWall, { x: targetVelocity * 0.5, y: 0 });
        }
      }
      animFrame = requestAnimationFrame(updateLaserWall);
    };
    updateLaserWall();

    return () => {
      cancelAnimationFrame(animFrame);
      Render.stop(render);
      if (runnerRef.current) Runner.stop(runnerRef.current);
      if (engineRef.current) Engine.clear(engineRef.current);
      if (render.canvas) render.canvas.remove();
    };
  }, [containerRef]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto overflow-hidden">
      {/* Deep Space Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #00F0FF33 1px, transparent 1px), linear-gradient(to bottom, #00F0FF33 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Matter.js Canvas Container */}
      <div ref={sceneRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

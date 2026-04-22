'use client'

import React, { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Color, Triangle, Transform } from 'ogl'

// --- Shader 部分：加入手機判斷與安全邏輯 ---
const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShader = `
precision mediump float;
varying vec2 vUv;
uniform float iTime;
uniform vec3 iResolution;
uniform float uScale;
uniform vec2 uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uNoiseAmp;
uniform float uChromaticAberration;
uniform float uDither;
uniform float uCurvature;
uniform vec3 uTint;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uUseMouse;
uniform float uBrightness;
uniform float uIsLightMode; 
uniform float uIsMobile; // 新增：判斷是否為手機

float time;

float hash21(vec2 p){
  p = fract(p * 234.56);
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2; 
}

mat2 rotate(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float fbm(vec2 p) {
  p *= 1.1;
  float f = 0.0;
  float amp = 0.5 * uNoiseAmp;
  f += amp * noise(p);
  p = rotate(time * 0.02) * p * 2.0;
  amp *= 0.454545;
  if (uIsMobile > 0.5) return f; // 手機端：減少迭代
  f += amp * noise(p);
  p = rotate(time * 0.02) * p * 2.0;
  amp *= 0.454545;
  f += amp * noise(p);
  return f;
}

float pattern(vec2 p, out vec2 q, out vec2 r) {
  q = vec2(fbm(p + 1.0), fbm(rotate(0.1 * time) * p + 1.0));
  r = vec2(fbm(rotate(0.1) * q), fbm(q));
  return fbm(p + r);
}

float digit(vec2 p){
    vec2 grid = uGridMul * 15.0;
    vec2 s = floor(p * grid) / grid;
    p = p * grid;
    vec2 q, r;
    float intensity = pattern(s * 0.1, q, r) * 1.3 - 0.03;
    if(uUseMouse > 0.5){
        vec2 mouseWorld = uMouse * uScale;
        float distToMouse = distance(s, mouseWorld);
        float mouseInfluence = exp(-distToMouse * 8.0) * uMouseStrength * 10.0;
        intensity += mouseInfluence;
        if (uIsMobile < 0.5) { // 手機端關閉漣漪計算
           intensity += sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;
        }
    }
    p = fract(p) * uDigitSize;
    float n = dot(floor(p.xy * 5.0) - 2.0, floor(p.xy * 5.0) - 2.0);
    float isOn = step(0.1, intensity - (n * 0.0625));
    return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * isOn * (0.2 + (1.0-p.y) * 0.8);
}

float onOff(float a, float b, float c) {
  return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
}

float displace(vec2 look) {
    float y = look.y - mod(iTime * 0.25, 1.0);
    float window = 1.0 / (1.0 + 50.0 * y * y);
    return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window;
}

vec3 getColor(vec2 p){
    float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;
    bar *= uScanlineIntensity;
    float displacement = (uIsMobile > 0.5) ? 0.0 : displace(p);
    p.x += displacement;
    
    float middle = digit(p);
    float sum = middle; 
    
    // 手機端跳過九次採樣優化效能
    if (uIsMobile < 0.5) {
        const float off = 0.002;
        sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + digit(p + vec2(off, -off)) +
              digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0)) + digit(p + vec2(off, 0.0)) +
              digit(p + vec2(-off, off)) + digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));
        sum *= 0.1;
    }
    
    vec3 baseColor = vec3(0.9) * middle + sum * vec3(1.0) * bar;
    if (uIsLightMode > 0.5) return (1.0 - baseColor * 0.4);
    return baseColor;
}

vec2 barrel(vec2 uv){
  vec2 c = uv * 2.0 - 1.0;
  float r2 = dot(c, c);
  c *= 1.0 + uCurvature * r2;
  return c * 0.5 + 0.5;
}

void main() {
    time = iTime * 0.333333;
    vec2 uv = vUv;
    if(uCurvature != 0.0 && uIsMobile < 0.5){ uv = barrel(uv); }
    vec2 p = uv * uScale;
    vec3 col = getColor(p);
    if(uChromaticAberration != 0.0 && uIsMobile < 0.5){
      vec2 ca = vec2(uChromaticAberration) / iResolution.xy;
      col.r = getColor(p + ca).r;
      col.b = getColor(p - ca).b;
    }
    
    col *= uTint;
    if (uIsLightMode > 0.5) col = mix(vec3(1.0), col, 0.15);
    col *= uBrightness;
    
    if(uDither > 0.0){
      float rnd = hash21(gl_FragCoord.xy);
      col += (rnd - 0.5) * (uDither * 0.003922);
    }
    gl_FragColor = vec4(col, 1.0);
}
`

export const InteractiveGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef(0)
  const programRef = useRef<Program | null>(null)

  useEffect(() => {
    const ctn = containerRef.current
    if (!ctn) return

    // 判斷手機端
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth < 768
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2)

    const renderer = new Renderer({ dpr, alpha: true })
    const gl = renderer.gl
    const scene = new Transform() // 解決 forEach 報錯的關鍵

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Color(ctn.offsetWidth, ctn.offsetHeight, ctn.offsetWidth / ctn.offsetHeight),
        },
        uScale: { value: 1.8 },
        uGridMul: { value: new Float32Array([2, 1]) },
        uDigitSize: { value: 1.8 },
        uScanlineIntensity: { value: 0.6 },
        uGlitchAmount: { value: 1.1 },
        uFlickerAmount: { value: 0.4 },
        uNoiseAmp: { value: 0.8 },
        uChromaticAberration: { value: 0.04 },
        uDither: { value: 1 },
        uCurvature: { value: 0.05 },
        uTint: { value: new Color(0.31, 0.46, 0.97) },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseStrength: { value: 0.8 },
        uUseMouse: { value: 1 },
        uBrightness: { value: 1.2 },
        uIsLightMode: { value: 0 },
        uIsMobile: { value: isMobile ? 1 : 0 },
      },
    })

    programRef.current = program
    const mesh = new Mesh(gl, { geometry, program })
    mesh.setParent(scene)

    const updateTheme = () => {
      if (!programRef.current) return
      const isDark = document.documentElement.classList.contains('dark')
      const tint = isDark ? [0.31, 0.46, 0.97] : [0.4, 0.6, 1.0]
      programRef.current.uniforms.uTint.value = new Color(tint[0], tint[1], tint[2])
      programRef.current.uniforms.uIsLightMode.value = isDark ? 0 : 1
      programRef.current.uniforms.uBrightness.value = isDark ? 1.2 : 0.95
    }
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const handleResize = () => {
      if (!ctn || !programRef.current) return
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight)
      programRef.current.uniforms.iResolution.value = new Color(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height
      )
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = ctn.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1 - (e.clientY - rect.top) / rect.height,
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    handleResize()

    const update = (t: number) => {
      rafRef.current = requestAnimationFrame(update)
      if (!programRef.current || !programRef.current.uniforms.uMouse) return

      programRef.current.uniforms.iTime.value = t * 0.001 * 0.2
      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.08
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.08

      programRef.current.uniforms.uMouse.value[0] = smoothMouseRef.current.x
      programRef.current.uniforms.uMouse.value[1] = smoothMouseRef.current.y

      renderer.render({ scene })
    }
    rafRef.current = requestAnimationFrame(update)
    ctn.appendChild(gl.canvas)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      observer.disconnect()
      programRef.current = null
      if (gl.canvas.parentElement === ctn) ctn.removeChild(gl.canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1]">
      <div
        ref={containerRef}
        className="absolute inset-0 z-[-2] bg-white transition-colors duration-500 dark:bg-gray-950"
      />
      <div className="absolute inset-0 z-[-1] bg-white/30 backdrop-blur-[6px] transition-colors duration-500 dark:bg-gray-950/40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  )
}

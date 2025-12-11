// @ts-nocheck
"use client"

import { useEffect, useRef } from "react"

type Snowflake = {
    x: number
    y: number
    r: number
    d: number
    angle: number
    rotationSpeed: number
    pattern: number
}

export default function Snow() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // 🔥 Important : on récupère le devicePixelRatio
        const dpr = window.devicePixelRatio || 1

        let width = window.innerWidth
        let height = window.innerHeight

        // On set la taille CSS
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`

        // On set la taille "réelle" du canvas en pixels
        canvas.width = width * dpr
        canvas.height = height * dpr

        // On scale le contexte pour dessiner en coordonnées "normales"
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

        const FLAKE_COUNT = 70

        const flakes: Snowflake[] = Array.from({ length: FLAKE_COUNT }, () => {
            const size = Math.random() ** 1.5 * 16 + 2
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                r: size,
                d: Math.random() * 0.5 + size * 0.05,
                angle: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                pattern: Math.floor(Math.random() * 4)
            }
        })

        function update() {
            for (const f of flakes) {
                f.y += f.d
                f.angle += f.rotationSpeed
                f.x += Math.sin(f.y * 0.01) * 0.3

                if (f.y > height + 10) {
                    f.y = -10
                    f.x = Math.random() * width
                }
                if (f.x < -10) f.x = width + 10
                if (f.x > width + 10) f.x = -10
            }
        }

        function drawBranch(length: number, thickness: number) {
            ctx.lineWidth = thickness
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(0, -length)
            ctx.stroke()

            const sideLength = length * 0.4
            const positions = [0.3, 0.6, 0.85]

            for (const pos of positions) {
                const y = -length * pos
                const sideLen = sideLength * (1 - pos * 0.3)

                ctx.beginPath()
                ctx.moveTo(0, y)
                ctx.lineTo(-sideLen * 0.5, y - sideLen * 0.7)
                ctx.stroke()

                ctx.beginPath()
                ctx.moveTo(0, y)
                ctx.lineTo(sideLen * 0.5, y - sideLen * 0.7)
                ctx.stroke()
            }
        }

        function snowFlake1(r: number) {
            for (let i = 0; i < 6; i++) {
                ctx.save()
                ctx.rotate((Math.PI * 2 * i) / 6)
                drawBranch(r, 1.2)
                ctx.restore()
            }
        }

        function snowFlake2(r: number) {
            ctx.lineWidth = 1.5
            ctx.beginPath()
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI * 2 * i) / 6
                const x = Math.cos(angle) * r * 0.3
                const y = Math.sin(angle) * r * 0.3
                if (i === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
            }
            ctx.closePath()
            ctx.stroke()

            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI * 2 * i) / 6
                ctx.save()
                ctx.rotate(angle)
                ctx.translate(0, -r * 0.3)

                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.lineTo(0, -r * 0.7)
                ctx.stroke()

                ctx.beginPath()
                ctx.moveTo(0, -r * 0.35)
                ctx.lineTo(-r * 0.15, -r * 0.5)
                ctx.moveTo(0, -r * 0.35)
                ctx.lineTo(r * 0.15, -r * 0.5)
                ctx.stroke()

                ctx.restore()
            }
        }

        function snowFlake3(r: number) {
            for (let i = 0; i < 6; i++) {
                ctx.save()
                ctx.rotate((Math.PI * 2 * i) / 6)

                ctx.lineWidth = 1.2
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.lineTo(0, -r)
                ctx.stroke()

                const positions = [0.4, 0.7]
                for (const pos of positions) {
                    const y = -r * pos
                    const size = r * 0.25 * (1 - pos * 0.3)

                    ctx.lineWidth = 0.8
                    ctx.beginPath()
                    ctx.moveTo(-size, y)
                    ctx.lineTo(0, y - size)
                    ctx.lineTo(size, y)
                    ctx.stroke()
                }

                ctx.restore()
            }
        }

        function snowFlake4(r: number) {
            for (let i = 0; i < 6; i++) {
                ctx.save()
                ctx.rotate((Math.PI * 2 * i) / 6)

                ctx.lineWidth = 1.2
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.lineTo(0, -r)
                ctx.stroke()

                const branchPoints = [0.33, 0.66, 0.9]
                for (let j = 0; j < branchPoints.length; j++) {
                    const y = -r * branchPoints[j]
                    const branchLen = r * 0.3 * (1 - branchPoints[j] * 0.4)

                    ctx.lineWidth = 1

                    ctx.beginPath()
                    ctx.moveTo(0, y)
                    ctx.lineTo(-branchLen * 0.7, y - branchLen * 0.5)
                    ctx.stroke()

                    ctx.beginPath()
                    ctx.moveTo(0, y)
                    ctx.lineTo(branchLen * 0.7, y - branchLen * 0.5)
                    ctx.stroke()

                    if (j < 2) {
                        const miniSize = branchLen * 0.3
                        ctx.lineWidth = 0.7

                        ctx.beginPath()
                        ctx.moveTo(-branchLen * 0.7, y - branchLen * 0.5)
                        ctx.lineTo(-branchLen * 0.9, y - branchLen * 0.3)
                        ctx.stroke()

                        ctx.beginPath()
                        ctx.moveTo(branchLen * 0.7, y - branchLen * 0.5)
                        ctx.lineTo(branchLen * 0.9, y - branchLen * 0.3)
                        ctx.stroke()
                    }
                }

                ctx.restore()
            }
        }

        function drawSnowflake(f: Snowflake) {
            const { x, y, r, angle, pattern } = f

            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(angle)
            ctx.strokeStyle = "rgba(255,255,255,0.85)"
            ctx.lineCap = "round"
            ctx.lineJoin = "round"

            switch (pattern) {
                case 0:
                    snowFlake1(r)
                    break
                case 1:
                    snowFlake2(r)
                    break
                case 2:
                    snowFlake3(r)
                    break
                case 3:
                    snowFlake4(r)
                    break
            }

            ctx.restore()
        }

        function draw() {
            ctx.clearRect(0, 0, width, height)

            for (const f of flakes) {
                drawSnowflake(f)
            }

            update()
            requestAnimationFrame(draw)
        }

        draw()

        const onResize = () => {
            width = window.innerWidth
            height = window.innerHeight

            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            canvas.width = width * dpr
            canvas.height = height * dpr

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        window.addEventListener("resize", onResize)
        return () => {
            window.removeEventListener("resize", onResize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-[5] opacity-75"
        />
    )
}
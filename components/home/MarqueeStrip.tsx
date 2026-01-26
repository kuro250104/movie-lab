"use client"

import Marquee from "react-fast-marquee"

type Props = { items: string[] }

export function MarqueeStrip({ items }: Props) {
    return (
        <div className="overflow-hidden border-y border-gray-800 bg-gradient-to-r from-gray-50 to-white py-4 text-black shadow-inner">
            <Marquee gradient={false} speed={40} className="text-lg font-semibold uppercase tracking-wider">
                {items.concat(items, items).map((text, index) => (
                    <div key={index} className="mx-8 whitespace-nowrap flex items-center">
                        {text}
                    </div>
                ))}
            </Marquee>
        </div>
    )
}
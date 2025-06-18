import { Search, Triangle, Lightbulb, MapPin, Settings } from "lucide-react"

export default function FlipCards() {
    const cards = [
        {
            id: 1,
            type: "image",
            title: "Focused Investigation",
            icon: Search,
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
            backText:
                "Dive deep into research and analysis with systematic investigation methods. Develop critical thinking skills through structured inquiry and evidence-based exploration.",
            className: "bg-black/80",
        },
        {
            id: 2,
            type: "image",
            title: "Focused Investigation",
            icon: Search,
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
            backText:
                "Dive deep into research and analysis with systematic investigation methods. Develop critical thinking skills through structured inquiry and evidence-based exploration.",
            className: "bg-black/80",
        },
        {
            id: 3,
            type: "image",
            title: "Design Your Path",
            icon: Triangle,
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
            backText:
                "Create personalized learning journeys tailored to your goals and interests. Take control of your educational experience with flexible, adaptive pathways.",
            className: "bg-black/80",
        },
        {
            id: 4,
            type: "image",
            title: "Sketch to Structure",
            icon: Lightbulb,
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
            backText:
                "Transform initial ideas into well-organized frameworks. Learn to develop concepts from rough sketches into comprehensive, structured solutions.",
            className: "bg-black/80",
        },
        {
            id: 5,
            type: "image",
            title: "Launch and Lead",
            icon: MapPin,
            image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop",
            backText:
                "Take initiative and guide projects from conception to completion. Develop leadership skills while bringing innovative ideas to life in collaborative environments.",
            className: "bg-black/80",
        },
        {
            id: 6,
            type: "image",
            title: "Creative Display",
            icon: Settings,
            image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop",
            backText:
                "Showcase your work through innovative presentation methods. Learn to communicate ideas effectively using creative visualization and display techniques.",
            className: "bg-black/80",
        },
    ]

    return (
        <div className="bg-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <h1 className="text-4xl py-8 font-bold text-center text-black mb-12">
                    Britanilka Design Thinking
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <div key={card.id} className="flip-card h-64 group">
                            <div className="flip-card-inner relative w-full h-full transition-transform duration-700 transform-gpu group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d' }}>
                                {/* Front Side */}
                                <div className="flip-card-front absolute w-full h-full" style={{ backfaceVisibility: 'hidden' }}>

                                    <div className="relative rounded-xl overflow-hidden h-full">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${card.image})` }}
                                        />
                                        <div
                                            className={`${card.className} absolute inset-0 flex flex-col items-center justify-center text-white`}
                                        >
                                            <div className="bg-cyan-500 p-3 rounded-lg mb-4">
                                                {card.icon && <card.icon className="w-8 h-8 text-white" />}
                                            </div>
                                            <h3 className="text-xl font-bold text-center px-4">{card.title}</h3>
                                        </div>
                                    </div>

                                </div>

                                {/* Back Side */}
                                <div className="flip-card-back absolute w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                    <div className="bg-fourth rounded-xl p-8 h-full flex items-center justify-center shadow-lg">
                                        <p className="text-textColor text-center leading-relaxed">{card.backText}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
import InvestigationIcon from '../../../../assets/dashboard/Educator/footer/1.svg';
import AnalysisIcon from '../../../../assets/dashboard/Educator/footer/2.svg';
import DesignIcon from '../../../../assets/dashboard/Educator/footer/3.svg';
import SketchIcon from '../../../../assets/dashboard/Educator/footer/4.svg';
import LaunchIcon from '../../../../assets/dashboard/Educator/footer/5.svg';
import CreativeIcon from '../../../../assets/dashboard/Educator/footer/6.svg';
import Image1 from '../../../../assets/dashboard/Educator/footer/1.jpg';
import Image2 from '../../../../assets/dashboard/Educator/footer/2.jpg';
import Image3 from '../../../../assets/dashboard/Educator/footer/3.jpg';
import Image4 from '../../../../assets/dashboard/Educator/footer/4.jpg';
import Image5 from '../../../../assets/dashboard/Educator/footer/5.jpg';
import Image6 from '../../../../assets/dashboard/Educator/footer/6.jpg';

export default function FlipCards() {
    const cards = [
        {
            id: 1,
            type: "image",
            title: "Driving Problems",
            icon: InvestigationIcon,
            iconSize: { width: '64px', height: '64px' },
            image: Image1,
            backText:
                "Bridge learning with reality through case studies or real stories.",
        },
        {
            id: 2,
            type: "image",
            title: "Focused Investigation",
            icon: AnalysisIcon,
            iconSize: { width: '64px', height: '64px' },
            image: Image2,
            backText:
                "Research, conduct surveys, and gather relevant data.",
        },
        {
            id: 3,
            type: "image",
            title: "Design Your Path",
            icon: DesignIcon,
            iconSize: { width: '52px', height: '52px' },
            image: Image3,
            backText:
                "Brainstorm, plan, and ideate innovative solutions.",
        },
        {
            id: 4,
            type: "image",
            title: "Sketch to Structure",
            icon: SketchIcon,
            iconSize: { width: '60px', height: '60px' },
            image: Image4,
            backText:
                "Create a working model of your solution.",
        },
        {
            id: 5,
            type: "image",
            title: "Launch and Lead",
            icon: LaunchIcon,
            iconSize: { width: '90px', height: '90px' },
            image: Image5,
            backText:
                "Deploy the solution and run an awareness drive.",
        },
        {
            id: 6,
            type: "image",
            title: "Creative Display",
            icon: CreativeIcon,
            iconSize: { width: '64px', height: '64px' },
            image: Image6,
            backText:
                "Showcase final project to peers, educators, and stakeholders; and take feedback to complete your understanding.",
        },
    ];

    return (
        <div className="bg-white p-8 pb-28">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <h1 className="text-4xl py-8 font-bold text-center text-textColor mb-12">
                    Britannica Design Thinking
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {cards.map((card) => (
                        <div key={card.id} className="flip-card h-56 group">
                            <div className="flip-card-inner relative w-full h-full transition-transform duration-700 transform-gpu group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d' }}>
                                {/* Front Side */}
                                <div className="flip-card-front absolute w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
                                    <div className="relative rounded-xl overflow-hidden h-full">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${card.image})` }}
                                        />
                                        <div
                                            className="absolute inset-0 flex flex-col items-center justify-center text-white"
                                        >
                                            <img
                                                src={card.icon}
                                                alt={card.title}
                                                style={{ width: card.iconSize.width, height: card.iconSize.height }}
                                                className="mb-4"
                                            />
                                            <h3 className="text-2xl font-bold text-center px-4">{card.title}</h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Back Side */}
                                <div className="flip-card-back absolute w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                    <div className="bg-fourth rounded-xl p-8 h-full flex items-center justify-center">
                                        <p className="text-textColor text-center text-xl font-bold leading-relaxed">{card.backText}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 
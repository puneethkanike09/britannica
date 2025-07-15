import InvestigationIcon from '../../../../assets/dashboard/Educator/footer/1. Driving Problem.svg';
import AnalysisIcon from '../../../../assets/dashboard/Educator/footer/6. Focused Investigation.svg';
import DesignIcon from '../../../../assets/dashboard/Educator/footer/3. Design Your Path.svg';
import SketchIcon from '../../../../assets/dashboard/Educator/footer/4. Sketch To Structure.svg';
import LaunchIcon from '../../../../assets/dashboard/Educator/footer/5. Launch and Lead.svg';
import CreativeIcon from '../../../../assets/dashboard/Educator/footer/Group 1261156796.svg';
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
            title: "Driving Problem",
            icon: InvestigationIcon,
          
            image: Image1,
            backText:
                "Bridge learning with reality through case studies or real stories.",
        },
        {
            id: 2,
            type: "image",
            title: "Focused Investigation",
            icon: AnalysisIcon,
          
            image: Image2,
            backText:
                "Research, conduct surveys, and gather relevant data.",
        },
        {
            id: 3,
            type: "image",
            title: "Design Your Path",
            icon: DesignIcon,
         
            image: Image3,
            backText:
                "Brainstorm, plan, and ideate innovative solutions.",
        },
        {
            id: 4,
            type: "image",
            title: "Sketch to Structure",
            icon: SketchIcon,
           
            image: Image4,
            backText:
                "Create a working model of your solution.",
        },
        {
            id: 5,
            type: "image",
            title: "Launch and Lead",
            icon: LaunchIcon,
           
            image: Image5,
            backText:
                "Deploy the solution and run an awareness drive.",
        },
        {
            id: 6,
            type: "image",
            title: "Creative Display",
            icon: CreativeIcon,
           
            image: Image6,
            backText:
                "Showcase final project to peers, educators, and stakeholders; and take feedback to complete your understanding.",
        },
    ];

    return (
        <div className="bg-white p-4 sm:p-6 md:p-8 pb-16 sm:pb-20 md:pb-24 lg:pb-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl py-6 sm:py-8 md:py-10 font-bold text-center text-textColor mb-8 sm:mb-10 md:mb-12">
                    Britannica Design Thinking
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                    {cards.map((card) => (
                        <div key={card.id} className="flip-card h-48 sm:h-52 md:h-56 lg:h-60">
                            <div className="flip-card-inner">
                                {/* Front Side */}
                                <div className="flip-card-front">
                                    <div className="relative rounded-xl overflow-hidden h-full">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${card.image})` }}
                                        />
                                        <div
                                            className="absolute inset-0 flex flex-col items-center justify-center text-white p-3 sm:p-4 md:p-6"
                                        >
                                            <img
                                                src={card.icon}
                                                alt={card.title}
                                                className={`mb-2 sm:mb-3 md:mb-4 ${card.id === 1 ? 'w-14 h-14 sm:w-20 sm:h-20 md:w-22 md:h-22 lg:w-24 lg:h-24' : 'w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18'}`}
                                            />
                                            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-center px-2 sm:px-3 md:px-4 leading-tight sm:leading-normal">
                                                {card.title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Back Side */}
                                <div className="flip-card-back">
                                    <div className="bg-fourth rounded-xl p-4 sm:p-6 md:p-8 h-full flex items-center justify-center">
                                        <p className="text-textColor text-center text-lg sm:text-lg md:text-lg lg:text-xl font-bold leading-relaxed sm:leading-relaxed md:leading-relaxed">
                                            {card.backText}
                                        </p>
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
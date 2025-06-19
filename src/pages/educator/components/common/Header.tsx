import BackgroundImage from '../../../../assets/dashboard/Educator/home-page/kids.png';
// Import the PNG images for icons
import ResearchIcon from '../../../../assets/dashboard/Educator/header/1.svg';
import InterdisciplinaryIcon from '../../../../assets/dashboard/Educator/header/2.svg';
import SkillsIcon from '../../../../assets/dashboard/Educator/header/3.svg';
import SgdsIcon from '../../../../assets/dashboard/Educator/header/4.svg';
import RealWorldIcon from '../../../../assets/dashboard/Educator/header/5.svg';

export default function BritannicaHeroSection() {
    return (
        <section className="relative pt-26 sm:pt-34 md:pt-36 py-12 sm:py-16 md:py-24 lg:py-32 xl:py-40">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src={BackgroundImage}
                    alt="Students learning together"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-10 lg:px-12">
                <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-3 sm:mb-4 md:mb-6">Britannica build</h1>
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-yellow-400 font-bold">
                        Learn by Doing, Grow by Exploring
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                    <div className="text-center group ">
                        <div className="mb-3 sm:mb-4 flex justify-center">
                            <img
                                src={ResearchIcon}
                                alt="Research based learning"
                                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-hover:brightness-125"
                            />
                        </div>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">Research based</h3>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">learning</h3>
                    </div>

                    <div className="text-center group ">
                        <div className="mb-3 sm:mb-4 flex justify-center">
                            <img
                                src={InterdisciplinaryIcon}
                                alt="Interdisciplinary connection"
                                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-hover:brightness-125"
                            />
                        </div>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">Interdisciplinary</h3>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">connection</h3>
                    </div>

                    <div className="text-center group ">
                        <div className="mb-3 sm:mb-4 flex justify-center">
                            <img
                                src={SkillsIcon}
                                alt="21st century skills"
                                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-hover:brightness-125"
                            />
                        </div>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">Focus on 21st</h3>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">century skills</h3>
                    </div>

                    <div className="text-center group ">
                        <div className="mb-3 sm:mb-4 flex justify-center">
                            <img
                                src={SgdsIcon}
                                alt="Alignment with SGDS"
                                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-hover:brightness-125"
                            />
                        </div>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">Alignment with</h3>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">SGDS</h3>
                    </div>

                    <div className="text-center col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1 mx-auto group ">
                        <div className="mb-3 sm:mb-4 flex justify-center">
                            <img
                                src={RealWorldIcon}
                                alt="Real-world connection"
                                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-hover:brightness-125"
                            />
                        </div>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">Real-world</h3>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">connection</h3>
                    </div>
                </div>
            </div>
        </section>
    );
}
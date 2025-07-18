import BackgroundImage from '../../../../assets/dashboard/Educator/home-page/kids.png';
// Import the PNG images for icons
import ResearchIcon from '../../../../assets/dashboard/Educator/header/1.png';
import InterdisciplinaryIcon from '../../../../assets/dashboard/Educator/header/22.svg';
import SkillsIcon from '../../../../assets/dashboard/Educator/header/33.svg';
import SDGsIcon from '../../../../assets/dashboard/Educator/header/5.png';
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
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-3 sm:mb-4 md:mb-6">Britannica Build</h1>
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-yellow-400 font-bold">
                        Learn by Doing, Grow by Exploring
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                    <div className="text-center group cursor-pointer touch-manipulation">
                        <div className="mb-3 sm:mb-4 flex justify-center">
                            <img
                                src={ResearchIcon}
                                alt="Research based learning"
                                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-hover:brightness-125 group-active:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-active:brightness-125 group-focus:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-focus:brightness-125"
                            />
                        </div>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-active:text-blue-300 group-active:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-focus:text-blue-300 group-focus:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">Research-based</h3>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-active:text-blue-300 group-active:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-focus:text-blue-300 group-focus:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">learning</h3>
                    </div>

                    <div className="text-center group cursor-pointer touch-manipulation">
                        <div className="mb-3 sm:mb-4 flex justify-center">
                            <img
                                src={InterdisciplinaryIcon}
                                alt="Interdisciplinary connection"
                                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-hover:brightness-125 group-active:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-active:brightness-125 group-focus:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-focus:brightness-125"
                            />
                        </div>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-active:text-blue-300 group-active:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-focus:text-blue-300 group-focus:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">Interdisciplinary</h3>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-active:text-blue-300 group-active:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-focus:text-blue-300 group-focus:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">connection</h3>
                    </div>

                    <div className="text-center group cursor-pointer touch-manipulation">
                        <div className="mb-3 sm:mb-4 flex justify-center">
                            <img
                                src={SkillsIcon}
                                alt="21st century skills"
                                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-hover:brightness-125 group-active:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-active:brightness-125 group-focus:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-focus:brightness-125"
                            />
                        </div>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-active:text-blue-300 group-active:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-focus:text-blue-300 group-focus:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">Focus on</h3>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-active:text-blue-300 group-active:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-focus:text-blue-300 group-focus:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">21st-century skills</h3>
                    </div>

                    <div className="text-center group cursor-pointer touch-manipulation">
                        <div className="mb-3 sm:mb-4 flex justify-center">
                            <img
                                src={SDGsIcon}
                                alt="Alignment with SDGs"
                                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-hover:brightness-125 group-active:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-active:brightness-125 group-focus:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-focus:brightness-125"
                            />
                        </div>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-active:text-blue-300 group-active:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-focus:text-blue-300 group-focus:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">Alignment with</h3>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-active:text-blue-300 group-active:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-focus:text-blue-300 group-focus:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">SDGs</h3>
                    </div>
                    <div className="text-center col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1 mx-auto group cursor-pointer touch-manipulation">
                        <div className="mb-3 sm:mb-4 flex justify-center">
                            <img
                                src={RealWorldIcon}
                                alt="Alignment with SDGs"
                                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-hover:brightness-125 group-active:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-active:brightness-125 group-focus:drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] group-focus:brightness-125"
                            />
                        </div>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-active:text-blue-300 group-active:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-focus:text-blue-300 group-focus:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">Real-world</h3>
                        <h3 className="text-white font-bold sm:text-xl md:text-2xl mb-1 sm:mb-2 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-active:text-blue-300 group-active:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] group-focus:text-blue-300 group-focus:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">connection</h3>
                    </div>
                </div>
            </div>
        </section>
    );
}
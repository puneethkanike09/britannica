import { BookOpen, Network, Brain, Target, Globe } from "lucide-react"
import BackgroundImage from '../../../../assets/dashboard/Educator/home-page/kids.png';

export default function BritannicaHeroSection() {
    return (
        <section className="relative py-20 md:py-32 lg:py-40">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src={BackgroundImage}
                    alt="Students learning together"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4">
                <div className="text-center mb-16 md:mb-20">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:mb-6">Britannica build</h1>
                    <p className="text-xl md:text-2xl lg:text-3xl text-yellow font-bold">
                        Learn by Doing, Grow by Exploring
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6">
                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-cyan-400" />
                        </div>
                        <h3 className="text-white font-semibold text-lg md:text-xl mb-2">Research based</h3>
                        <p className="text-white text-base md:text-lg">learning</p>
                    </div>

                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <Network className="w-12 h-12 md:w-16 md:h-16 text-cyan-400" />
                        </div>
                        <h3 className="text-white font-semibold text-lg md:text-xl mb-2">Interdisciplinary</h3>
                        <p className="text-white text-base md:text-lg">connection</p>
                    </div>

                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <Brain className="w-12 h-12 md:w-16 md:h-16 text-cyan-400" />
                        </div>
                        <h3 className="text-white font-semibold text-lg md:text-xl mb-2">Focus on 21st</h3>
                        <p className="text-white text-base md:text-lg">century skills</p>
                    </div>

                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <Target className="w-12 h-12 md:w-16 md:h-16 text-cyan-400" />
                        </div>
                        <h3 className="text-white font-semibold text-lg md:text-xl mb-2">Alignment with</h3>
                        <p className="text-white text-base md:text-lg">SGDS</p>
                    </div>

                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <Globe className="w-12 h-12 md:w-16 md:h-16 text-cyan-400" />
                        </div>
                        <h3 className="text-white font-semibold text-lg md:text-xl mb-2">Real-world</h3>
                        <p className="text-white text-base md:text-lg">connection</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
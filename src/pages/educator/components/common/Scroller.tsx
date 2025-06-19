export default function ScrollingBanner() {
    const quote = "The aim of education should be to teach us rather how to think, than what to think. – James Beattie";
    const marqueeItems = Array(3).fill(quote);

    return (
        <div className="w-full">
            {/* Top scrolling section */}
            <div className="bg-primary text-white py-6 md:py-10 overflow-hidden relative">
                <div className="flex animate-marquee">
                    {marqueeItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 px-44 md:px-52 font-bold text-lg md:text-xl whitespace-nowrap"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom static section */}
            <div className="bg-gray-100 text-textColor py-6 md:py-10 text-center px-4">
                <h2 className="text-lg md:text-xl font-semibold">Real Problems. Real Teams. Real Impact</h2>
            </div>

        </div>
    );
}
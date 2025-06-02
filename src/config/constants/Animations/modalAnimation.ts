import { Variants } from "framer-motion";

export const modalVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 1.1,
        filter: "blur(10px)",
    },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.1,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        scale: 1.1,
        filter: "blur(10px)",
        transition: {
            duration: 0.1,
            ease: "easeIn",
        },
    },
};

export const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};
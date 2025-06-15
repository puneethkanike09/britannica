import React from 'react';
import { LoaderProps } from '../../types/global';



const Loader: React.FC<LoaderProps> = ({ message }) => {
    return (
        <div className="flex justify-center items-center">
            <style>
                {`
                    .loader {
                        width: 45px;
                        height: 45px;
                        display: inline-block;
                        border: 3px solid var(--color-primary, #00a2e3);
                        border-radius: 50%;
                        border-top-color: transparent;
                        border-bottom-color: transparent;
                        animation: rot5 1s infinite;
                    }

                    @keyframes rot5 {
                        0% {
                            transform: rotate(0);
                        }
                        50% {
                            transform: rotate(180deg);
                            border-top-color: var(--color-secondary, #141e8c);
                            border-bottom-color: var(--color-secondary, #141e8c);
                            border-right-color: transparent;
                            border-left-color: transparent;
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                `}
            </style>
            <div className="flex flex-col items-center space-y-4">
                <div className="loader"></div>
                {message && <p className="text-textColor font-medium">{message}</p>}
            </div>
        </div>
    );
};

export default Loader;
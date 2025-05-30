import { useState, useEffect } from "react";

const AnimatedDiv = ({ children, delay = 0, className = "" }) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), delay);
		return () => clearTimeout(timer);
	}, [delay]);

	return (
		<div
			className={`transform transition-all duration-700 ${
				isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
			} ${className}`}
		>
			{children}
		</div>
	);
};

export default AnimatedDiv;

import { Star } from "lucide-react";

export default function Testimonial() {
	const testimonials = [
		{
			name: "Victoria Chen",
			location: "Singapore",
			text: "From the moment we arrived, every detail exceeded our expectations. The suite was a masterpiece of elegance, and the personalized service made us feel like royalty. The spa treatment was transcendent, and dining was an absolute culinary journey.",
			highlight: "Exceptional Service",
		},
		{
			name: "James Wellington",
			location: "London, UK",
			text: "I've stayed at luxury hotels worldwide, but this experience was unparalleled. The attention to detail in our penthouse suite was remarkable - from the hand-selected artwork to the premium linens. The concierge anticipated our every need before we even asked.",
			highlight: "Unmatched Luxury",
		},
		{
			name: "Isabella Rodriguez",
			location: "Madrid, Spain",
			text: "Our anniversary celebration here was absolutely magical. The private butler service, the exquisite champagne selection, and the breathtaking views created memories we'll treasure forever. This is hospitality elevated to an art form.",
			highlight: "Unforgettable Experience",
		},
	];

	return (
		<div className="flex flex-col gap-8">
			{testimonials.map((testmonial, i) => (
				<div className="perspective-distant" key={i}>
					<div
						className="bg-f rounded-2xl px-8 py-12 flex gap-6 flex-col 
                        transform transition-all duration-400 ease-out
                        hover:rotate-y-6 hover:rotate-x-3 hover:translate-z-4
                        hover:shadow-[0_30px_60px_-12px_rgba(92,51,23,0.4)]
                        shadow-lg cursor-pointer"
					>
						<div className="flex gap-6 justify-center">
							{Array(5)
								.fill()
								.map((_, index) => (
									<Star className="h-6 w-6 text-amber-400 fill-current" key={index} />
								))}
						</div>
						<p className="font-young italic text-c">&quot;{testmonial.text}&quot;</p>
						<div className="flex flex-col items-center">
							<p className="font-young text-amber-400">{testmonial.name}</p>
							<p className="font-young text-c">{testmonial.location}</p>
							<p className="font-young w-fit px-4 py-1 mt-4 text-g rounded-full bg-b">
								{testmonial.highlight}
							</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

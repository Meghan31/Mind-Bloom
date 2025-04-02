import { useMood } from '@/context/MoodContext';
import { motion } from 'framer-motion';
// import { useMood } from './MoodContext'; // Adjust the path accordingly

const moods = [
	{ name: 'Happy', color: 'bg-yellow-400', text: 'text-yellow-900' },
	{ name: 'Relaxed', color: 'bg-green-400', text: 'text-green-900' },
	{ name: 'Confident', color: 'bg-blue-400', text: 'text-blue-900' },
	{ name: 'Calm', color: 'bg-gray-400', text: 'text-gray-900' },
	{ name: 'Content', color: 'bg-orange-400', text: 'text-orange-900' },
	{ name: 'Reflective', color: 'bg-purple-400', text: 'text-purple-900' },
	{ name: 'Sad', color: 'bg-blue-600', text: 'text-white' },
	{ name: 'Anxious', color: 'bg-red-500', text: 'text-white' },
	{ name: 'Frustrated', color: 'bg-red-700', text: 'text-white' },
	{ name: 'Bittersweet', color: 'bg-pink-500', text: 'text-white' },
	{ name: 'Nostalgic', color: 'bg-indigo-500', text: 'text-white' },
	{ name: 'Conflicted', color: 'bg-gray-700', text: 'text-white' },
];

const Moods = () => {
	const { selectedMood, setSelectedMood } = useMood();

	return (
		<div className="flex flex-wrap justify-center gap-4 p-6">
			{moods.map((mood) => (
				<motion.button
					key={mood.name}
					className={`w-24 h-12 rounded-lg font-semibold shadow-lg ${mood.color} ${mood.text}`}
					animate={{ scale: selectedMood === mood.name ? 1.3 : 1 }}
					whileHover={{ scale: 1.1, rotate: 5 }}
					whileTap={{ scale: 0.9, rotate: 10 }}
					transition={{ type: 'spring', stiffness: 300 }}
					onClick={() => {
						if (selectedMood !== mood.name) {
							console.log(`Mood selected: ${mood.name}`);
							setSelectedMood(mood.name);
							setTimeout(() => setSelectedMood(null), 60000); // Reset after 1 minute
						}
					}}
				>
					{mood.name}
				</motion.button>
			))}
		</div>
	);
};

export default Moods;

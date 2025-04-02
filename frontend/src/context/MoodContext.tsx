import { createContext, ReactNode, useContext, useState } from 'react';

type MoodContextType = {
	selectedMood: string | null;
	setSelectedMood: (mood: string | null) => void;
};

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider = ({ children }: { children: ReactNode }) => {
	const [selectedMood, setSelectedMood] = useState<string | null>(null);

	return (
		<MoodContext.Provider value={{ selectedMood, setSelectedMood }}>
			{children}
		</MoodContext.Provider>
	);
};

export const useMood = () => {
	const context = useContext(MoodContext);
	if (!context) {
		throw new Error('useMood must be used within a MoodProvider');
	}
	return context;
};

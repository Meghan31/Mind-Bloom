import { Button } from '@/components/ui/button';
import { useMood } from '@/context/MoodContext';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

export default function JournalEntry() {
	const { selectedMood } = useMood(); // Get the selected mood
	const [journalEntry, setJournalEntry] = useState<string>('');

	const saveEntry = () => {
		if (!journalEntry || !selectedMood) {
			toast.error(
				'Please select your mood and write a journal entry before saving.',
				{
					position: 'top-right',
				}
			);
			return;
		}

		console.log('Journal Entry:', { mood: selectedMood, entry: journalEntry });

		setJournalEntry(''); // Clear the entry after saving
		toast.success('Journal entry saved successfully!', {
			position: 'top-right',
		});
	};

	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">Journal Entry</h2>
			<ToastContainer />
			<div className="flex flex-col justify-center items-center gap-4">
				{selectedMood && (
					<p className="text-lg font-semibold">
						Mood: <span className="text-blue-600">{selectedMood}</span>
					</p>
				)}

				<textarea
					className="border rounded-md p-2 w-full"
					rows={5}
					placeholder="Write your journal entry here..."
					style={{
						resize: 'none',
						width: '100%',
						maxWidth: '1000px',
					}}
					value={journalEntry}
					onChange={(e) => setJournalEntry(e.target.value)}
				/>

				<Button className="flex w-56" onClick={saveEntry}>
					Save Entry
				</Button>
			</div>
		</div>
	);
}

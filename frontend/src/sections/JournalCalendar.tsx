import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { journalAPI } from '../api';

interface JournalEntry {
	id: number;
	content: string;
	mood: string;
	entry_date: string;
	affirmation_content: string | null;
}

// Helper function to format date as YYYY-MM-DD
const formatDateForAPI = (date: Date): string => {
	return format(date, 'yyyy-MM-dd');
};

export default function JournalCalendar() {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date()
	);
	const [entriesByDate, setEntriesByDate] = useState<
		Record<string, JournalEntry[]>
	>({});
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [selectedEntries, setSelectedEntries] = useState<JournalEntry[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
	const [lastSelectedDate, setLastSelectedDate] = useState<string>('');

	// Get all entries on component mount
	useEffect(() => {
		fetchAllEntries();
	}, []);

	// Fetch all journal entries for the user
	const fetchAllEntries = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const entries = await journalAPI.getAllEntries();
			console.log('API Response:', entries); // Debug: Log the actual API response

			// If entries is undefined or not an array, handle the error
			if (!entries || !Array.isArray(entries)) {
				console.error('API did not return an array of entries:', entries);
				setError('Failed to fetch journal entries: Invalid response format');
				setIsLoading(false);
				return;
			}

			// Group entries by date
			const groupedEntries: Record<string, JournalEntry[]> = {};
			const datesToHighlight: Date[] = [];

			entries.forEach((entry: any) => {
				// Safely extract date from entry
				let dateStr = '';
				if (entry.entry_date) {
					dateStr = entry.entry_date.split('T')[0]; // Use entry_date if available
				} else if (entry.created_at) {
					dateStr = entry.created_at.split('T')[0]; // Try created_at as fallback
				} else if (entry.createdAt) {
					dateStr = entry.createdAt.split('T')[0]; // Try createdAt as another fallback
				} else {
					// If no date field is found, use current date as fallback
					dateStr = new Date().toISOString().split('T')[0];
					console.warn('No date field found for entry:', entry);
				}

				// Create a standardized entry object
				const standardizedEntry: JournalEntry = {
					id: entry.id,
					content: entry.content || '',
					mood: entry.mood || '',
					entry_date: dateStr,
					affirmation_content: entry.affirmation_content || null,
				};

				if (!groupedEntries[dateStr]) {
					groupedEntries[dateStr] = [];
					// Create a date object for the calendar highlighting
					// Use noon time to avoid timezone issues
					const highlightDate = new Date(dateStr + 'T12:00:00');
					datesToHighlight.push(highlightDate);
				}
				groupedEntries[dateStr].push(standardizedEntry);
			});

			setEntriesByDate(groupedEntries);
			setHighlightedDates(datesToHighlight);
			console.log(
				'Dates to highlight:',
				datesToHighlight.map((d) => formatDateForAPI(d))
			);

			// After loading entries, check if selectedDate has entries and open dialog
			if (selectedDate) {
				const formattedDate = formatDateForAPI(selectedDate);
				const entriesForDate = groupedEntries[formattedDate];
				if (entriesForDate) {
					setSelectedEntries(entriesForDate);
					setIsDialogOpen(true);
					setLastSelectedDate(formattedDate);
				}
			}
		} catch (error) {
			console.error('Error in fetchAllEntries:', error);
			setError(
				error instanceof Error
					? error.message
					: 'Failed to fetch journal entries'
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle date selection
	const handleDateSelect = async (date: Date | undefined) => {
		if (!date) return;

		const formattedDate = formatDateForAPI(date);
		console.log(
			'Selected date:',
			formattedDate,
			'Last selected:',
			lastSelectedDate
		);

		// Always update the selected date
		setSelectedDate(date);

		// If selecting the same date again, just open the dialog with existing entries
		if (formattedDate === lastSelectedDate && !isDialogOpen) {
			console.log('Re-selected same date, reopening dialog');
			setIsDialogOpen(true);
			return;
		}

		// Update the last selected date
		setLastSelectedDate(formattedDate);

		// If we already have entries for this date, use them
		if (entriesByDate[formattedDate]) {
			console.log('Using cached entries for date:', formattedDate);
			setSelectedEntries(entriesByDate[formattedDate]);
			setIsDialogOpen(true);
			return;
		}

		// Otherwise, fetch entries for this date
		setIsLoading(true);
		setError(null);

		try {
			const entries = await journalAPI.getEntriesByDate(formattedDate);
			console.log('Date entries response:', entries); // Debug: Log the response

			// If no entries or invalid response, handle gracefully
			if (!entries || !Array.isArray(entries)) {
				setSelectedEntries([]);
				setIsDialogOpen(true);
				setIsLoading(false);
				return;
			}

			// Standardize entries
			const standardizedEntries: JournalEntry[] = entries.map((entry: any) => {
				// Determine the date string
				let dateStr = '';
				if (entry.entry_date) {
					dateStr = entry.entry_date.split('T')[0];
				} else if (entry.created_at) {
					dateStr = entry.created_at.split('T')[0];
				} else if (entry.createdAt) {
					dateStr = entry.createdAt.split('T')[0];
				} else {
					dateStr = formattedDate;
				}

				return {
					id: entry.id,
					content: entry.content || '',
					mood: entry.mood || '',
					entry_date: dateStr,
					affirmation_content: entry.affirmation_content || null,
				};
			});

			// If we found entries, add this date to highlighted dates
			if (standardizedEntries.length > 0) {
				// Create a date object for the calendar highlighting
				const highlightDate = new Date(formattedDate + 'T12:00:00');
				setHighlightedDates((prev) => {
					// Check if the date is already in the array to avoid duplicates
					if (!prev.some((d) => formatDateForAPI(d) === formattedDate)) {
						return [...prev, highlightDate];
					}
					return prev;
				});
			}

			// Update entries by date
			setEntriesByDate((prev) => ({
				...prev,
				[formattedDate]: standardizedEntries,
			}));

			setSelectedEntries(standardizedEntries);
			setIsDialogOpen(true);
		} catch (error) {
			console.error('Error in handleDateSelect:', error);
			setError(
				error instanceof Error
					? error.message
					: 'Failed to fetch journal entries for selected date'
			);
			// Show dialog anyway, but with empty entries
			setSelectedEntries([]);
			setIsDialogOpen(true);
		} finally {
			setIsLoading(false);
		}
	};

	// Helper function to determine dot color based on mood
	const getMoodColor = (mood: string): string => {
		const moodColors: Record<string, string> = {
			Happy: 'bg-yellow-400',
			Relaxed: 'bg-green-400',
			Confident: 'bg-blue-400',
			Calm: 'bg-gray-400',
			Content: 'bg-orange-400',
			Reflective: 'bg-purple-400',
			Sad: 'bg-blue-600',
			Anxious: 'bg-red-500',
			Frustrated: 'bg-red-700',
			Bittersweet: 'bg-pink-500',
			Nostalgic: 'bg-indigo-500',
			Conflicted: 'bg-gray-700',
		};

		return moodColors[mood] || 'bg-gray-500';
	};

	// Handle closing the dialog
	const onDialogClose = (open: boolean) => {
		setIsDialogOpen(open);

		// If dialog is closed, reset lastSelectedDate to allow reopening the same date
		if (!open) {
			console.log('Dialog closed, resetting lastSelectedDate');
			setLastSelectedDate('');
		}
	};

	return (
		<div className="flex flex-col items-center p-6">
			<h2 className="text-2xl font-bold mb-6">Journal Calendar</h2>

			{error && (
				<div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
					{error}
				</div>
			)}

			<div className="border rounded-md p-4 shadow-sm">
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={handleDateSelect}
					className="rounded-md"
					disabled={isLoading}
					modifiers={{
						highlighted: highlightedDates,
					}}
					modifiersStyles={{
						highlighted: {
							fontWeight: 'bold',
							textDecoration: 'underline',
							backgroundColor: 'rgba(59, 130, 246, 0.1)',
						},
					}}
				/>
			</div>

			<div className="mt-4 text-sm text-center text-gray-500">
				Dates with underlines have journal entries. Click on a date to view
				entries.
			</div>

			{/* Dialog to show entries for selected date */}
			<Dialog open={isDialogOpen} onOpenChange={onDialogClose}>
				<DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							Journal Entries for{' '}
							{selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
						</DialogTitle>
						<DialogDescription>
							{selectedEntries.length > 0
								? `You have ${selectedEntries.length} ${
										selectedEntries.length === 1 ? 'entry' : 'entries'
								  } for this date.`
								: 'No journal entries for this date.'}
						</DialogDescription>
					</DialogHeader>

					{selectedEntries.length > 0 ? (
						<div className="space-y-4 mt-4">
							{selectedEntries.map((entry) => (
								<div key={entry.id} className="border rounded-md p-4">
									<div className="flex items-center gap-2 mb-2">
										<div
											className={`w-3 h-3 rounded-full ${getMoodColor(
												entry.mood
											)}`}
										></div>
										<span className="font-medium">{entry.mood}</span>
									</div>
									<p className="text-sm mb-3">{entry.content}</p>
									{entry.affirmation_content && (
										<div className="bg-gray-100 p-3 rounded-md italic text-sm">
											<span className="font-medium">Affirmation:</span>{' '}
											{entry.affirmation_content}
										</div>
									)}
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-4">
							<p>No journal entries found for this date.</p>
							<Button
								variant="outline"
								className="mt-4"
								onClick={() => onDialogClose(false)}
							>
								Close
							</Button>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

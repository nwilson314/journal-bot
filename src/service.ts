export interface JournalEntry {
	id: number;
	content: string;
	analyzed_content?: string;
	created_at: string;
	updated_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function getJournalEntry(id: number): Promise<JournalEntry> {
	const response = await fetch(`${API_URL}/journal/${id}`);
	if (!response.ok) {
		throw new Error('Failed to fetch journal entry');
	}
	return response.json();
}

export async function createJournalEntry(content: string): Promise<JournalEntry> {
	const response = await fetch(`${API_URL}/journal`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ content })
	});
	if (!response.ok) {
		throw new Error('Failed to create journal entry');
	}
	return response.json();
}

export async function updateJournalEntry(id: number, content: string): Promise<JournalEntry> {
	const response = await fetch(`${API_URL}/journal/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ content })
	});
	if (!response.ok) {
		throw new Error('Failed to update journal entry');
	}
	return response.json();
}

export async function deleteJournalEntry(id: number): Promise<void> {
	const response = await fetch(`${API_URL}/journal/${id}`, {
		method: 'DELETE'
	});
	if (!response.ok) {
		throw new Error('Failed to delete journal entry');
	}
}

export async function analyzeJournalEntry(id: number, content: string): Promise<JournalEntry> {
	const response = await fetch(`${API_URL}/journal/${id}/analyze`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ content })
	});

	if (!response.ok) {
		throw new Error('Failed to analyze journal entry');
	}

	return response.json();
}

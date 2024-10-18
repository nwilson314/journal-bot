<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		getJournalEntry,
		updateJournalEntry,
		deleteJournalEntry,
		analyzeJournalEntry,
		type JournalEntry
	} from '../../../service';

	let journalEntry: JournalEntry | null = null;
	let journalHtml: string = '';
	let analyzedHtml: string = '';
	let editedContent: string = '';
	let isEditing: boolean = false;
	let isAnalyzing: boolean = false;
	let error: string | null = null;

	// Get the journal ID from the URL parameters
	$: journalId = $page.params.id;

	onMount(async () => {
		try {
			journalEntry = await getJournalEntry(parseInt(journalId));

			if (journalEntry) {
				journalHtml = await marked.parse(journalEntry.content);
				analyzedHtml = journalEntry.analyzed_content
					? await marked.parse(journalEntry.analyzed_content)
					: '';
				editedContent = journalEntry.content;
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = 'An unknown error occurred.';
			}
		}
	});

	const toggleEdit = () => {
		isEditing = !isEditing;
	};

	const handleUpdate = async () => {
		try {
			if (journalEntry) {
				await updateJournalEntry(journalEntry.id, editedContent);
				journalHtml = await marked.parse(editedContent);
				analyzedHtml = '';
				toggleEdit();
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = 'An unknown error occurred.';
			}
		}
	};

	const handleDelete = async () => {
		if (
			confirm('Are you sure you want to delete this journal entry? This action cannot be undone.')
		) {
			try {
				if (journalEntry) {
					await deleteJournalEntry(journalEntry.id);
					goto('/journal');
				}
			} catch (err: unknown) {
				if (err instanceof Error) {
					error = err.message;
				} else {
					error = 'An unknown error occurred.';
				}
			}
		}
	};

	const handleAnalyze = async () => {
		isAnalyzing = true;
		try {
			if (journalEntry) {
				const analyzedEntry = await analyzeJournalEntry(journalEntry.id, editedContent);
				analyzedHtml = analyzedEntry.analyzed_content
					? await marked.parse(analyzedEntry.analyzed_content)
					: '';
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = 'An unknown error occurred.';
			}
		} finally {
			isAnalyzing = false;
		}
	};
</script>

<section class="p-8 bg-white min-h-screen">
	<h1 class="text-4xl font-bold mb-4">Journal Entry</h1>

	{#if error}
		<p class="text-red-500">Error: {error}</p>
	{:else if journalEntry}
		<div class="mb-6 space-x-4 flex items-center">
			<button
				class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800"
				on:click={toggleEdit}
			>
				{isEditing ? 'Cancel' : 'Edit'}
			</button>
			<button
				class="px-4 py-2 bg-gray-400 text-white rounded flex items-center hover:bg-gray-600"
				on:click={handleAnalyze}
				disabled={isAnalyzing}
			>
				{#if isAnalyzing}
					<svg
						class="animate-spin h-5 w-5 mr-2 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
						></path>
					</svg>
					Analyzing...
				{:else}
					Analyze
				{/if}
			</button>
			<button
				class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
				on:click={handleDelete}
			>
				Delete
			</button>
		</div>

		{#if isEditing}
			<textarea
				bind:value={editedContent}
				class="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				placeholder="Edit your journal entry here..."
			></textarea>
			<button
				class="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-800"
				on:click={handleUpdate}
			>
				Update
			</button>
		{:else}
			<div class="border border-gray-300 rounded-lg p-6 bg-gray-50">
				<div
					class="prose max-w-full prose-h1:mb-3 prose-h1:text-3xl prose-h2:mb-3 prose-h2:mt-0 prose-p:m-1 prose-li:m-0 prose-ul:m-1 prose-ul:pl-2"
				>
					{@html journalHtml}
				</div>
			</div>
		{/if}
		{#if analyzedHtml}
			<div class="border border-gray-300 rounded-lg p-6 bg-gray-50 mt-4">
				<h2 class="text-xl font-bold mb-4">Analyzed Content</h2>
				<div
					class="prose max-w-full prose-h1:mb-3 prose-h1:text-3xl prose-h2:mb-3 prose-h2:mt-0 prose-p:m-1 prose-li:m-0 prose-ul:m-1 prose-ul:pl-2"
				>
					{@html analyzedHtml}
				</div>
			</div>
		{/if}
	{:else}
		<p>Loading...</p>
	{/if}
</section>

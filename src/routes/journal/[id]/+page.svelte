<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		getJournalEntry,
		updateJournalEntry,
		deleteJournalEntry,
		type JournalEntry
	} from '../../../service';

	let journalEntry: JournalEntry | null = null;
	let journalHtml: string = '';
	let editedContent: string = '';
	let isEditing: boolean = false;
	let error: string | null = null;

	// Get the journal ID from the URL parameters
	$: journalId = $page.params.id;

	onMount(async () => {
		try {
			journalEntry = await getJournalEntry(parseInt(journalId));

			if (journalEntry) {
				journalHtml = await marked.parse(journalEntry.content);
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
</script>

<section class="p-8 bg-white min-h-screen">
	<h1 class="text-4xl font-bold mb-4">Journal Entry</h1>

	{#if error}
		<p class="text-red-500">Error: {error}</p>
	{:else if journalEntry}
		<div class="mb-6 space-x-4">
			<button
				class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				on:click={toggleEdit}
			>
				{isEditing ? 'Cancel' : 'Edit'}
			</button>
			<button
				class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
				class="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
				on:click={handleUpdate}
			>
				Update
			</button>
		{:else}
			<div
				class="prose max-w-full prose-h1:mb-3 prose-h1:text-3xl prose-h2:mb-3 prose-h2:mt-0 prose-p:m-1 prose-li:m-0 prose-ul:m-1 prose-ul:pl-2"
			>
				{@html journalHtml}
			</div>
		{/if}
	{:else}
		<p>Loading...</p>
	{/if}
</section>

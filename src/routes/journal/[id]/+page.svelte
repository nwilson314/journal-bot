<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';

	import { page } from '$app/stores';
	import { getJournalEntry, type JournalEntry } from '../../../service';

	let journalEntry: JournalEntry | null = null;
	let journalHtml: string = '';
	let error: string | null = null;

	// Get the journal ID from the URL parameters
	$: journalId = $page.params.id;

	onMount(async () => {
		try {
			journalEntry = await getJournalEntry(parseInt(journalId));

			if (journalEntry) {
				journalHtml = await marked.parse(journalEntry.content);
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = 'An unknown error occurred.';
			}
		}
	});
</script>

<section class="p-8 bg-white min-h-screen">
	<h1 class="text-4xl font-bold mb-4">Journal Entry</h1>

	{#if journalEntry}
		<div
			class="prose max-w-full prose-h1:mb-3 prose-h1:text-3xl prose-h2:mb-3 prose-h2:mt-0 prose-p:m-1 prose-li:m-1 prose-ul:m-1"
		>
			{@html journalHtml}
		</div>
	{:else}
		<p>No journal entry found.</p>
	{/if}
</section>

<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { marked } from 'marked';

	let journalEntry = '';
	let journalHtml = '';

	// Get the journal ID from the URL parameters
	$: journalId = $page.params.id;

	onMount(async () => {
		// Load the journal entry from localStorage (later, load this from the backend)
		const entry = localStorage.getItem(journalId);
		if (entry) {
			journalEntry = entry;
			journalHtml = await marked.parse(journalEntry);
			console.log(journalHtml);
		}
	});
</script>

<section class="p-8 bg-white min-h-screen">
	<h1 class="text-4xl font-bold mb-4">Journal Entry</h1>

	{#if journalEntry}
		<div
			class="prose max-w-full prose-h1:mb-3 prose-h1:text-3xl prose-p:m-1 prose-li:m-1 prose-ul:m-1"
		>
			{@html journalHtml}
		</div>
	{:else}
		<p>No journal entry found.</p>
	{/if}
</section>

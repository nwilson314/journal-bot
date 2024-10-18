<script lang="ts">
	import { goto } from '$app/navigation';
	import { createJournalEntry } from '../../service';

	let journalContent = '';

	async function submitJournal() {
		try {
			const entry = await createJournalEntry(journalContent);
			goto(`/journal/${entry.id}`);
		} catch (err: unknown) {
			if (err instanceof Error) {
				alert(err.message);
			} else {
				alert('An unknown error occurred.');
			}
		}
	}
</script>

<section class="p-8 bg-white min-h-screen">
	<h1 class="text-3xl font-bold mb-4">Your Journal</h1>
	<p class="mb-6 text-lg">Write down your thoughts below (supports Markdown):</p>

	<textarea
		bind:value={journalContent}
		class="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		placeholder="Start writing your journal entry here..."
	></textarea>

	<button
		class="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-800"
		on:click={submitJournal}
	>
		Submit Journal
	</button>
</section>

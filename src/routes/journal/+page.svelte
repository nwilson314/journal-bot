<script>
	import { goto } from '$app/navigation';

	let journalEntry = '';

	const submitJournal = () => {
		// Generate a simple unique ID (will come from the backend later)
		const id = Date.now().toString();
		// Store the journal in localStorage for now (later, will send it to the backend)
		localStorage.setItem(id, journalEntry);

		goto(`/journal/${id}`);
	};
</script>

<section class="p-8 bg-white min-h-screen">
	<h1 class="text-3xl font-bold mb-4">Your Journal</h1>
	<p class="mb-6 text-lg">Write down your thoughts below (supports Markdown):</p>

	<textarea
		bind:value={journalEntry}
		class="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		placeholder="Start writing your journal entry here..."
	></textarea>

	<button
		class="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
		on:click={submitJournal}
	>
		Submit Journal
	</button>
</section>

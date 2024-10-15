<script>
	import { goto } from '$app/navigation';

	const startJournaling = () => {
		goto('/journal');
	};
</script>

<section class="flex flex-col items-center justify-center h-screen bg-blue-50">
	<h1 class="text-4xl font-bold mb-8">Welcome to Your Journaling App</h1>
	<p class="text-xl mb-4">Start documenting your thoughts in a secure and simple way.</p>
	<button
		class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
		on:click={startJournaling}
	>
		Start Journaling
	</button>
</section>
